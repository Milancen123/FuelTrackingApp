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
            pricePerLiter: Number(log.totalPrice) / Number(log.volume)  // add new field
        }));

        console.log(mapped);
const prompt = `
You are an AI analyst for a fuel-tracking application.

TASK:
Analyze the provided vehicle fuel logs and return **only** a JSON object that lists the top 3–5 major anomalies, focusing exclusively on the **latest 3–5 entries**. Older logs should be used only for reference in calculations, such as computing average consumption and rolling price averages.

INPUT:
- The assistant will be given an array of log objects in place of user data at the end of this prompt. Each log object may contain:
  - odometer (number, km)
  - fuelAmount (number, liters)
  - price (number, total cost)
  - date (ISO timestamp, e.g. "2025-03-20T00:00:00.000+00:00")
  - fullTank (boolean)
  - pricePerLiter (number)
  - other fields may appear (e.g., _id, vehicleId) — ignore/remove them.

PREPROCESSING RULES:
1. Sort logs by date ascending (oldest → newest) for calculations.
2. Drop any identifier fields such as _id or vehicleId — do not include them in the output or anomaly text.
3. Compute consumption using only fullTank === true entries with a valid previous refuel.
4. Compute consumption in liters/100 km as: consumption = (fuelAmount / delta_km) * 100. Round to one decimal place.
5. Format all dates in anomalies as "Mon D, YYYY" (e.g., Oct 15, 2025).

ANOMALY DETECTION (latest 3–5 entries only):
- Compare each latest log’s computed consumption against the **vehicle’s overall average consumption** (all prior full-tank refuels). Flag as an anomaly if consumption is **≥ 25% higher** than the vehicle’s average.
- High price per liter: flag if pricePerLiter is **≥ 25% higher than the average** of the previous 5 full-tank refuels.
- Unusual odometer jump: delta_km <= 0 or delta_km > 1000 km.
- Duplicate/conflicting entries: same date & odometer but different fuelAmount or price.
- Impossible values: negative numbers, zero fuelAmount on fullTank === true, or pricePerLiter inconsistent with price/fuelAmount > 5%.

OUTPUT RULES:
- JSON ONLY, exactly in this shape:
{
  "anomalies": ["anomaly1", "anomaly2", "..."],
  "recommendations": ["recommendation1", "recommendation2", "..."]
}
- 1–5 anomaly strings, concise, each including:
  - description, affected date(s) ("Mon D, YYYY"), relevant numeric values.
- 3–8 actionable general fuel-saving recommendations: check tire pressure, change to winter tires, avoid rapid accelerations, smooth driving, monitor fuel prices.

ADDITIONAL NOTES:
- Focus exclusively on the **most recent logs**; ignore minor fluctuations.
- Skip any metric if insufficient data.
- Always use the requested date format and JSON shape. No extra commentary.

USER DATA:
${JSON.stringify(fuelLogs)}
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
