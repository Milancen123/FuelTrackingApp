import { getUserByClerkId } from "@/app/database";
import { handleError } from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const clerkId = searchParams.get("clerkId");
        if (!clerkId) {
            throw NotFoundError;
        }
        const result = await getUserByClerkId(clerkId);
        console.log("result from db is: " + result);

        return NextResponse.json({
            message:"success",
            data:result,
        },{
            status:200,
        });

    } catch (err) {
        console.error(err);
           return NextResponse.json({
            message: err,
            
        }, {
            status: 400
        });
    }
}
