// app/api/webhooks/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";


export async function POST(req: Request) {
  console.log("Pozvali su ovaj post request");
  const payload = await req.text(); 
  const svix_id =  (await headers()).get("svix-id");
  const svix_timestamp =(await headers()).get("svix-timestamp");
  const svix_signature = (await headers()).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing Clerk webhook headers", { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;
  console.log("✅ Webhook event:", type);

  try {
    // await dbConnect();
    

    

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Database error:", err);
    return new NextResponse("Database error", { status: 500 });
  }
}



