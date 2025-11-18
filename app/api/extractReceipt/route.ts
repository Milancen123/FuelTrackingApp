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
You are an OCR and Data Extraction AI specialized in Serbian fuel receipts.

YOUR TASK:
1. Perform OCR on the provided image.
2. Extract FUEL-ONLY information.
3. Return ONLY a JSON array with exactly ONE object.

INPUT:
You will receive a single receipt IMAGE.

OUTPUT FORMAT:
[
  {
    "totalAmount": number | null,   // fuel quantity in liters
    "totalPrice": number | null,    // final fuel total in EUR
    "date": "YYYY-MM-DD" | null,
    "country": string | null
  }
]

IMPORTANT DEFINITIONS:
- totalAmount = fuel quantity (кол / kol) in liters.
- totalPrice = FINAL fuel total (Укупно / ukupno), NOT the price per liter.
- date = purchase date converted to ISO.
- country = "Serbia" ONLY if RSD or Serbian indicators are present.

CURRENCY RULES:
1. If the final fuel total (Укупно / ukupno) is >= 200 (suggesting RSD), convert it to EUR.
2. If Serbian indicators appear ("Srbija", "Beograd", "NIS", "GAZPROM", "динара", "Србија"), assume RSD.
3. Convert RSD → EUR with: 1 EUR = 117.0 RSD.
4. If the receipt explicitly shows currency EUR, DO NOT convert.
5. If totalPrice is a small number (< 50) and no RSD indicators are present, assume EUR.

FUEL EXTRACTION RULES:
- Detect fuel line using terms: "diesel", "dizel", "dizel d2", "euro dizel", "d2",
  or Cyrillic: "дизел", "еуро дизел", "гориво".
- Identify fields by: 
  "Цена", "цена", "price", 
  "кoл", "кол", "kol", "количина",
  "Укупно", "укупно", "ukupno", "износ".
- Use ONLY the fuel line’s Укупно/ukupno as totalPrice.
- Ignore all other items (coffee, tolls, shop products).
- If multiple fuel lines exist → use the FIRST one.
- Replace commas with decimals (e.g., “17,38” → 17.38).

DATE RULES:
Recognize: DD.MM.YYYY, DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD  
Then convert to ISO: YYYY-MM-DD.

NULL RULE:
If any value cannot be confidently extracted → return null.

FINAL RULE (CRITICAL):
Your entire output MUST be ONLY the JSON array.  
No text, no explanation, no additional characters outside the JSON.

        `;

        const result = await model.generateContent([
            { inlineData: { data: base64, mimeType: file.type } },
            prompt,
        ]);

        const text = result.response.text();

        return Response.json({ raw: text });
    } catch (e:unknown) {
        console.error(e);
        //@ts-expect-error it returens status
        return Response.json({ error: e }, { status: e.status });
    }
}