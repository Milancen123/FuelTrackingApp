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
        const { vehicle, odometer, fuelFilled, totalPrice, date, fullTank} = await request.json();
        console.log(vehicle, odometer, fuelFilled, totalPrice, date);
        if (!vehicle || !odometer || !fuelFilled || !totalPrice || !date) {
            return NextResponse.json(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        console.log("OVO SAM DOBIO IZ JSONA");
        console.log(vehicle, odometer, fuelFilled, totalPrice, date, fullTank);
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
        if(fullTank) {
            //also get the info on the first odometer value for that vehicle
            console.log("OVO JE STO SALJEM U FUNKCIJU");
            console.log(vehicle);
            const objectId = new mongoose.Types.ObjectId(vehicle);
            const vehicleAllData = await getVehicleByID(objectId);
            const firstOdometerValue = vehicleAllData[0].odometer;

            const vehicleData = await getFuelLogsForVehicleID(vehicle, true);
            if (!vehicleData) {
                throw new Error("No vehicles data found");
            }

            const formattedData: FuelEntryType[] = vehicleData.map((fuelData: IFuelLog) => {
                return {
                    fuel_filled: fuelData.fuelAmount,
                    date: new Date(fuelData.date),
                    total_price: fuelData.price,
                    odometer: fuelData.odometer,
                    fullTank: fuelData.fullTank,
                }
            });

            formattedData.push({
                fuel_filled: Number(fuelFilled),
                date: new Date(date),
                total_price: Number(totalPrice),
                odometer: Number(odometer),
                fullTank:fullTank,
            });

            //odradi kalkulaciju svih ostalih parametara
            const average_consumption = totalAverageConsumption(formattedData ?? [], firstOdometerValue);
            const compare_for_last_month_consumption = compareLifetimeConsumption(formattedData ?? [], firstOdometerValue);
            const monthly_cost = totalSpentThisMonth(formattedData ?? []);
            const compare_for_last_month_cost = compareMonthlyFuelCost(formattedData ?? []);

            const updatedVehicle = await updateVehicleStats(vehicle, average_consumption, compare_for_last_month_consumption, monthly_cost, compare_for_last_month_cost);

            const newFuelLog = await saveFuelLogToDB({
                vehicleId: vehicle,
                odometer,
                fuelAmount: fuelFilled,
                price: totalPrice,
                date,
                average_consumption: 0.0,
                fullTank:fullTank,
            });


            return NextResponse.json({
                success: true,
                response: updatedVehicle,
                averageConsumptionBetweenTwoFillUps: 0.0,
            });
        }
        
        

        



        // const average_consumption = totalAverageConsumption(formattedData ?? []);
        // const compare_for_last_month_consumption = compareLifetimeConsumption(formattedData?? []);
        // const monthly_cost = totalSpentThisMonth(formattedData ?? []);
        // const compare_for_last_month_cost = compareMonthlyFuelCost(formattedData ?? []);


        // //the avg_coinsumption between two last fill ups (fuel_filled: number, current_odometer: number, previous_odometer: number)
        // const previous_odometer = (formattedData.length > 1) ? formattedData[formattedData.length - 2].odometer : 0;
        // const avg_consumption_between_two_last_fill_ups= (previous_odometer === 0 ? 0.0 : averageConsumptionBetweenTwoFillUps(fuelFilled, odometer, previous_odometer));
        



        const newFuelLog = await saveFuelLogToDB({
            vehicleId:vehicle,
            odometer,
            fuelAmount:fuelFilled,
            price:totalPrice,
            date,
            average_consumption:0,
            fullTank:fullTank,
        });

        console.log("SADA VRACAMO VEHICLE: ");
        // return vehicle with id to display the data about avg_consumption
        const vehicleByIdReturned = await getVehicleByID(vehicle);
        console.log(vehicleByIdReturned);
        return NextResponse.json({
            success:true,
            response:vehicleByIdReturned,
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


