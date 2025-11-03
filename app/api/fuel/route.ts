import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { getFuelLogsForVehicleID, getVehicleByID, saveFuelLogToDB, updateVehicleStats } from "@/app/database";
import { handleError } from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { CarType, FuelEntryType } from "@/types/car";
import { IFuelLog } from "@/database/fuelLog.model";
import { averageConsumptionBetweenTwoFillUps, compareLifetimeConsumption, totalAverageConsumption } from "@/lib/calculations/averageConsumption";
import { totalSpentThisMonth, compareMonthlyFuelCost } from "@/lib/calculations/averagePrice";

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
        //1. fetch the data for the vehicle ID specifically fuel data
        //2. extract the fuelData for that vehicle for calculation
        /*
        // 1. get fuel data
        // 2. calculate:
        //     2.1. total avg consumption
        //     2.2. compare avg consumption
        //     2.3. total monthly cost
        //     2.4. compare at monthly cost

        //3. calculate for FuelLogCard:
            //3.1. calculate average_consumption between current fill_up and previous fill_up
            //3.2. add it to the fuel document


            
        // 4. update vehicle with the caluclated data
        //     4.1. write the database function to put data for the vehicle id
        //     4.2. and update the vehicle with specified id with the following data:
        //         4.2.1. total avg consumption
        //         4.2.2. compare avg consumption
        //         4.2.3. total monthly cost
        //         4.2.4. compare at monthly const


        */

        const vehicleData = await getFuelLogsForVehicleID(vehicle, true);
        if(!vehicleData) {
            throw new Error("No vehicles data found");
        }

        const formattedData:FuelEntryType[] = vehicleData.map((fuelData:IFuelLog)  => {
            return {
                fuel_filled: fuelData.fuelAmount,
                date:new Date(fuelData.date),
                total_price:fuelData.price,
                odometer: fuelData.odometer,
            }
        });

        formattedData.push({
            fuel_filled:Number(fuelFilled),
            date:new Date(date),
            total_price:Number(totalPrice),
            odometer:Number(odometer),
        });



        const average_consumption = totalAverageConsumption(formattedData ?? []);
        const compare_for_last_month_consumption = compareLifetimeConsumption(formattedData?? []);
        const monthly_cost = totalSpentThisMonth(formattedData ?? []);
        const compare_for_last_month_cost = compareMonthlyFuelCost(formattedData ?? []);


        //the avg_coinsumption between two last fill ups (fuel_filled: number, current_odometer: number, previous_odometer: number)
        const previous_odometer = (formattedData.length > 1) ? formattedData[formattedData.length - 2].odometer : 0;
        const avg_consumption_between_two_last_fill_ups= (previous_odometer === 0 ? 0.0 : averageConsumptionBetweenTwoFillUps(fuelFilled, odometer, previous_odometer));
        
        const updatedVehicle = await updateVehicleStats(vehicle, average_consumption, compare_for_last_month_consumption, monthly_cost, compare_for_last_month_cost);


        const newFuelLog = await saveFuelLogToDB({
            vehicleId:vehicle,
            odometer,
            fuelAmount:fuelFilled,
            price:totalPrice,
            date,
            average_consumption:avg_consumption_between_two_last_fill_ups,
        });



        return NextResponse.json({
            success:true,
            response:updatedVehicle,
            averageConsumptionBetweenTwoFillUps:avg_consumption_between_two_last_fill_ups ?? 0.0,
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
        const res = await getFuelLogsForVehicleID(vehicleId, false);

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