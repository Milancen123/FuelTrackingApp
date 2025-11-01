import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { getFuelLogsForVehicleID, saveFuelLogToDB } from "@/app/database";
import { handleError } from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";

export async function POST(request: Request) {
    try {
        const { vehicle, odometer, fuelFilled, totalPrice, date } = await request.json();
        console.log(vehicle, odometer, fuelFilled, totalPrice, date);
        if (!vehicle || !odometer || !fuelFilled || !totalPrice || !date) {
            return NextResponse.json(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        const newFuelLog = await saveFuelLogToDB({
            vehicleId:vehicle,
            odometer,
            fuelAmount:fuelFilled,
            price:totalPrice,
            date,
        });

        return NextResponse.json({
            success:true,
            response:newFuelLog,
        })
    } catch (err) {
        console.error(err);
           return NextResponse.json({
            message: err,
            
        }, {
            status: 400
        });
    }
}

export async function GET(request:Request){
    try{
        await dbConnect();


        const {searchParams} = new URL(request.url);
        const id= searchParams.get("vehicleId");
        if(!id) {
            return NextResponse.json({
                success:false,
                message:"vehicleId is not included in the query params of the request",
            },{
                status:404,
            });
        }

        const vehicleId = new mongoose.Types.ObjectId(id);
        console.log(vehicleId);
        const res = await getFuelLogsForVehicleID(vehicleId);

        return NextResponse.json({
            success:true,
            response:res,
        }, {
            status:200,
        })
    }catch(err){
        console.log(err);
           return NextResponse.json({
            message: err,
            
        }, {
            status: 400
        });
    }
}