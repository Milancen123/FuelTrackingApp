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
Analyze the provided fuel logs and detect **duplicate entries**.

A duplicate entry is defined as:
1. Two or more logs that share the **same date AND the same odometer value**, OR
2. Two or more logs with the **same date** where the odometer order makes no sense (e.g., lower odometer after a higher one on the same day), OR
3. Two logs on the same date that appear to be duplicated except for a minor variation in fuelAmount or price (within ±5%).

WHAT TO FLAG:
- List each duplicate as a short anomaly description.
- Include the formatted date ("Mon D, YYYY") and the odometer value.
- Focus on the clearest 1–5 duplicate anomalies.

OUTPUT:
Return **only** a JSON object in this exact shape:

{
  "anomalies": ["anomaly1", "anomaly2", "..."],
  "recommendations": ["recommendation1", "recommendation2", "..."]
}

ANOMALIES:
- Write 1–5 short strings describing duplicate entries.
- Use formatted dates and odometer values.

RECOMMENDATIONS:
Provide 3–6 simple suggestions such as:
- review the logs for accidental double entries,
- avoid entering two logs for the same date unless necessary,
- ensure odometer values are recorded consistently,
- validate entries before saving,
- keep fuel receipts for verification.

STRICT RULES:
- No commentary outside the JSON.
- Ignore fields such as _id or vehicleId.
- Always use date format "Mon D, YYYY".
- Do not compute fuel consumption or any other metrics.

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
