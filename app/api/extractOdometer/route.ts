import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get("image") as File;

        if (!file) {
            return Response.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
        You are an OCR specialist for vehicle dashboards.

        TASK:
        Analyze the image of a car dashboard and extract the odometer reading, bigger value in number with the km or mi or some other distance value, so its always the biggest number on the dasboard.
        Do not confuse the odometer value with estimated trip distance or km counter for measuring distance until new service.

        REQUIREMENTS:
        - Read the odometer value as a plain number.
        - Do NOT include commas, units, labels, or any explanation.
        - If you are unsure or cannot read the odometer, return 0.

        OUTPUT FORMAT:
        Return ONLY the odometer number. No JSON. No text. No words.
        `;

        const result = await model.generateContent([
            { inlineData: { data: base64, mimeType: file.type } },
            prompt,
        ]);

        const text = result.response.text();

        return Response.json({ raw: text });
    } catch (e) {
        console.error(e);
        return Response.json({ error: e }, { status: 500 });
    }
}