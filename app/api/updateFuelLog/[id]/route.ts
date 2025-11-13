import { getFuelLogsForVehicleID, getVehicleStats, updateFuelLogById, updateVehicleStats } from "@/app/database";
import dbConnect from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { compareLifetimeConsumption, totalAverageConsumption } from "@/lib/calculations/averageConsumption";
import { compareMonthlyFuelCost, totalSpentThisMonth } from "@/lib/calculations/averagePrice";
import { FuelEntryType } from "@/types/car";


export async function POST(request:Request, context: { params: Promise<{ id: string }> } ) {
    try{
        const {userId} = await auth();
        if(!userId) {
            return NextResponse.json({
                message:"Not Authorized"
            }, {
                status:401,
            })
        }

        //proveriti da li se taj fuelLog id vezuje za korisnika koji pokusava da mu pristupi
        // jer moguce je pristupiti tudjim podacima ako smo ulogovani ako znamo id fuel loga jer aplikacija proverava samo da li smo autentifikovani a ne proverava ciji sadrzaj salje nazad
        //! ovo je hitno
        const { id } = await context.params;
        const fuelLogId = id;
        const {vehicleId, odometer, totalPrice, fuelAmount, fullTank, date} = await request.json();


        if(!fuelLogId || !vehicleId) {
            return NextResponse.json({
                message:"Parameters are not included",
            }, {
                status:400,
            })
        }

        

        await dbConnect();
        const response = await updateFuelLogById(new mongoose.Types.ObjectId(fuelLogId), Number(odometer), Number(fuelAmount), Number(totalPrice), new Date(date), fullTank);


        //get fuellogs for the vehicleId
        const fuelLogs = await getFuelLogsForVehicleID(vehicleId, true);

        const formattedFuelLogs:FuelEntryType[] = fuelLogs?.map((log)=>{
            return {
                fuel_filled: Number(log.fuelAmount),
                date: new Date(log.date),
                total_price: Number(log.price),
                odometer:Number(log.odometer),
                fullTank:log.fullTank,
            }
        })??[];


        const average_consumption = totalAverageConsumption(formattedFuelLogs ?? []);
        const compare_for_last_month_consumption = compareLifetimeConsumption(formattedFuelLogs ?? []);
        const monthly_cost = totalSpentThisMonth(formattedFuelLogs ?? []);
        const compare_for_last_month_cost = compareMonthlyFuelCost(formattedFuelLogs ?? []);


        // update vehicle
        await updateVehicleStats(vehicleId, average_consumption, compare_for_last_month_consumption, monthly_cost, compare_for_last_month_cost);


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