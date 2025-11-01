import { getVehicles, saveVehicleToDB } from "@/app/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { handleError } from "@/lib/handlers/error";
import { CarType, FuelEntryType } from "@/types/car";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("mongoID");
        console.log("id koji dobijam", id);
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
        console.log("OVO JE RESPONSE KADA FECUJEMO VOZILA:");
        console.log("-------------------------------------------");

        const formatted: CarType[] = response.map(v => ({
            id: v._id,
            name: `${v.make} ${v.model}`,
            last_fill_up: v.fuelData[v.fuelData.length - 1]?.fuelAmount ?? 0,
            odometer: Number(v.fuelData ? v.fuelData[v.fuelData.length - 1].odometer : v.odometer),
            active: false,
            fuelData: v.fuelData?.map((f): FuelEntryType => ({
                fuel_filled: f.fuelAmount,
                date: new Date(f.date),
                total_price: f.price,
                odometer: f.odometer,
                average_consumption: f.average_consumption ?? 0.0,
            })) || [],
        }));

        console.log(JSON.stringify(formatted));
        console.log("-------------------------------------------");
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

        console.log({ make, model, year, fuelType, odometer });
        const userId = new mongoose.Types.ObjectId(mongoid);
        const newVehicle = await saveVehicleToDB({
            userId,
            make,
            model,
            year,
            fuelType,
            odometer,
        });

        console.log(newVehicle);

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


