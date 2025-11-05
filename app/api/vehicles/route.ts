import { getVehicles, saveVehicleToDB } from "@/app/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { handleError } from "@/lib/handlers/error";
import { CarType, FuelEntryType } from "@/types/car";
import { IFuelLog } from "@/database/fuelLog.model";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("mongoID");

        if (!id) {
            return NextResponse.json({
                message: "failed",
            }, {
                status: 404,
            });
        }

        const userId = new mongoose.Types.ObjectId(id);
        const response = await getVehicles(userId);
        if (!response) return;

        const formatted: CarType[] = response.map(v => ({
            id: v._id,
            name: `${v.make} ${v.model}`,
            last_fill_up: v.fuelData[v.fuelData.length - 1]?.fuelAmount ?? 0,
            odometer: Number((v.fuelData && v.fuelData.length >= 1) ? v.fuelData[v.fuelData.length - 1].odometer : v.odometer),
            active: false,
            average_consumption: v.average_consumption, // Overall average consumption (L/100km)
            compare_for_last_month_consumption: v.compare_for_last_month_consumption,// % difference vs last month     // Monthly fuel cost
            compare_for_last_month_cost: v.compare_for_last_month_cost, // % difference vs last month cost
            fuelData: v.fuelData?.map((f:IFuelLog): FuelEntryType => ({
                fuel_filled: f.fuelAmount,
                date: new Date(f.date),
                total_price: f.price,
                odometer: f.odometer,
                average_consumption: f.average_consumption ?? 0.0,
                fullTank:f.fullTank,
            })) || [],
        }));

        
        return NextResponse.json({
            message: "success",
            data: formatted,
        }, {
            status: 200
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


export async function POST(request: Request) {
    try {
        const { mongoid, make, model, year, fuelType, odometer } = await request.json();

        // Validate input (optional but good practice)
        if (!make || !model || !year) {
            return NextResponse.json(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const userId = new mongoose.Types.ObjectId(mongoid);
        const newVehicle = await saveVehicleToDB({
            userId,
            make,
            model,
            year,
            fuelType,
            odometer,
        });


        return NextResponse.json({
            success: true,
            response: newVehicle,
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


