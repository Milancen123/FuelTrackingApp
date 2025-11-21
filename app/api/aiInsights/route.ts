import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const fuelLogs = body.fuelLogs;

        if (!fuelLogs || !Array.isArray(fuelLogs)) {
            return Response.json({ error: "fuelLogs array is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const mapped = fuelLogs.map(log => ({
            ...log,  // spread all existing properties
            date: new Date(log.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit"
            }),
            pricePerLiter: Number(log.price) / Number(log.fuelAmount)  // add new field
        }));

        console.log(mapped);
        const prompt = `
You are an AI analyst for a fuel-tracking application.

TASK:
Analyze the provided vehicle fuel logs and return **only** a JSON object (see OUTPUT section) that lists the top 3–5 major anomalies and practical recommendations to reduce fuel consumption.

INPUT:
- The assistant will be given an array of log objects in place of \${LOGS} at the end of this prompt. Each log object may contain:
  - odometer (number, km)
  - fuelAmount (number, liters)
  - price (number, total cost)
  - date (ISO timestamp, e.g. "2025-03-20T00:00:00.000+00:00")
  - fullTank (boolean)
  - pricePerLiter (number)
  - other fields may appear (e.g., _id, vehicleId) — ignore/remove them.

PREPROCESSING RULES:
1. Sort logs by date ascending (oldest → newest).
2. Drop any identifier fields such as _id or vehicleId — do not include them in the output or in anomaly text.
3. When computing fuel consumption, use only refuels where fullTank === true and where a prior refuel exists to produce a valid distance delta (delta_km = odometer_current - odometer_previous).
4. Compute consumption in liters/100 km as: consumption = (fuelAmount / delta_km) * 100. Round consumption values to one decimal place for reporting.
5. Format every date shown in anomaly text as "Mon D, YYYY" (example: Oct 15, 2025).

ANOMALY DETECTION (report only MAJOR anomalies — top 3–5):
Use these criteria (relative thresholds and absolute sanity checks):
- High consumption spike: A refuel where computed consumption is ≥ 20% higher than the rolling median of the previous 5 valid consumptions OR > 15 L/100km absolute.
- Unusual odometer jump / inconsistent distance: Consecutive logs where delta_km <= 0 or delta_km > 2000 km.
- Duplicate / conflicting entries: Multiple logs with the same date and identical odometer but different fuelAmount or price.
- Large price spike: pricePerLiter ≥ 20% above the rolling median pricePerLiter for the previous 30 days.
- Impossible values / sensor issues: Negative numbers, zero fuelAmount on a fullTank === true, or pricePerLiter inconsistent with price/fuelAmount by >5%.

OUTPUT RULES:
- JSON ONLY and exactly in this shape:
{
  "anomalies": ["anomaly1", "anomaly2", "..."],
  "recommendations": ["recommendation1", "recommendation2", "..."]
}
- Provide between 1 and 5 anomaly strings, each concise (one sentence) including:
  - brief description, affected date(s) formatted as "Mon D, YYYY", relevant numeric values.
- Provide 3–8 actionable recommendations, e.g., check tire pressure, change to winter tires, avoid rapid accelerations, smooth driving, verify odometer sensor, monitor fuel price patterns.

ADDITIONAL NOTES:
- Ignore minor fluctuations — focus on major anomalies.
- If insufficient data to compute a metric, skip it.
- Always follow the exact date format and JSON shape. No extra commentary.

USER DATA:
${JSON.stringify(mapped)}
`;





        const result = await model.generateContent(prompt);

        // Get model response
        const text = result.response.text();

        // Try to parse JSON safely
        let json;
        try {
            json = JSON.parse(text);
        } catch (err) {
            return Response.json(
                { error: "Model did not return valid JSON", raw: text },
                { status: 500 }
            );
        }

        return Response.json(json);
    } catch (e) {
        return Response.json(
            { error: e instanceof Error ? e.message : "Unknown error" },
            { status: 500 }
        );
    }
}
