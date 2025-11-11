import { getVehicleStats } from "@/app/database";
import dbConnect from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET(request:Request, { params }: { params: { id: string } }) {
    try{
        const {userId} = await auth();
        // if(!userId) {
        //     return NextResponse.json({
        //         message:"Not Authorized"
        //     }, {
        //         status:401,
        //     })
        // }
        const {id} = params;
        const vehicleId = id;

        if(!vehicleId) {
            return NextResponse.json({
                message:"Paramters not included",
            }, {
                status:400,
            })
        }
        await dbConnect();
        const response = await getVehicleStats(new mongoose.Types.ObjectId(vehicleId));
        console.log(response);


        return NextResponse.json({
            success:true,
            response,
        }, {
            status:200
        });


    }catch(err){
        console.error(err);
        return NextResponse.json({
            message: err,

        }, {
            status: 400
        });
    }
}