import { getFuelLogsByPage } from "@/app/database";
import { FuelLogCardProps } from "@/components/FuelLogCard";
import dbConnect from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function GET(request:Request) {
    try{
        const { userId } = await auth();

        // // 🧱 Step 2: Protect the route
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const { searchParams } = new URL(request.url);
        console.log("OVO JE REQUEST");
        console.log(request);
        let page = Number(searchParams.get("page"));
        const vehicleId = searchParams.get("vehicleId");

        if(!page) page = 1;
        
        await dbConnect();
        const response:FuelLogCardProps[] = await getFuelLogsByPage(page, vehicleId || "");


        return NextResponse.json({
            success: true,
            response,
        }, {
            status: 200,
        })

        
    }catch(err){
        console.error(err);
        return NextResponse.json({
            message: err,

        }, {
            status: 400
        });
    }
}