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
            pricePerLiter: log.price / log.fuelAmount  // add new field
        }));

const prompt = `
You are an AI analyst for a fuel-tracking application.

TASK:
Analyze the user's fuel logs to detect **significant anomalies and fuel consumption spikes**, and provide actionable recommendations.

IMPORTANT DETAILS:
- Fuel amount is in liters, odometer is in km.
- Only report **major anomalies**, top 3–5, and ignore minor variations.
- Format all dates like "Oct 15, 2025".
- Do not include fuelLog IDs.
- Focus on meaningful insights, e.g., high fuel consumption, unusual odometer jumps,large fuel consumption spikes,  large price spikes, or duplicate/conflicting entries.
- Provide recommendations that will help you keep the consumption low, and suggest to check tire pressure, change tires if the winter is coming, drive slowly, no rapid acceleartions.

OUTPUT:
- JSON ONLY, exactly in this format:

{
  "anomalies": ["anomaly1", "anomaly2", "..."],
  "recommendations": ["recommendation1", "recommendation2", "..."]
}

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
