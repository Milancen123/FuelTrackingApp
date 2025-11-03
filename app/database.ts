import FuelLog, { IFuelLog } from "@/database/fuelLog.model";
import User from "@/database/user.model";
import Vehicle, { IVehicle } from "@/database/vehicle.model";
import { handleError } from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { CarType } from "@/types/car";
import { model, models, Schema, Types } from "mongoose";


export const getVehicleByID = async (vehicleId: Types.ObjectId) => {
    try {
        await dbConnect();
        const vehicleData = await Vehicle.aggregate([
            { $match: { _id: vehicleId } },
            {
                $lookup: {
                    from: "fuellogs",
                    localField: "_id",
                    foreignField: "vehicleId",
                    as: "fuelData"
                }
            }
        ]);






        return vehicleData;

    } catch (error) {
        console.error(error);
    }
}






export const getVehicles = async (userId: Types.ObjectId) => {
    try {
        await dbConnect();
        const vehicles = await Vehicle.aggregate([
            {
                $match: { userId } // filter vehicles by owner
            },
            {
                $lookup: {
                    from: "fuellogs",          // collection name in DB (lowercase + plural)
                    localField: "_id",
                    foreignField: "vehicleId",
                    as: "fuelData"
                }
            }
        ]);

        return vehicles;
    } catch (error) {
        console.error(error);

    }
}

export const saveVehicleToDB = async ({ userId, make, model, year, fuelType, odometer }: IVehicle) => {
    try {
        await dbConnect();
        const newVehicle = await Vehicle.create({
            userId,
            make,
            model,
            year,
            fuelType,
            odometer
        });

        return {
            vehicleId: newVehicle._id
        };
    } catch (error) {
        console.error(error);

    }
}


export const updateVehicleStats = async (vehicleId: Types.ObjectId, average_consumption: number, compare_for_last_month_consumption: number, monthly_cost: number, compare_for_last_month_cost: number) => {
    try {
        await dbConnect();
        const updatePayload = {
            average_consumption,
            compare_for_last_month_consumption,
            monthly_cost,
            compare_for_last_month_cost

        }
        const res = await Vehicle.findByIdAndUpdate(
            vehicleId,
            {
                $set: {
                    average_consumption,
                    compare_for_last_month_consumption,
                    monthly_cost,
                    compare_for_last_month_cost,
                },
            },
            { new: true },
        );

        console.log("OVDE SAM SADAA", res);

        if (!res) throw new Error("Vehicle not found");
        return res;

    } catch (err) {
        console.log(err);

    }
}


export const getFuelLogsForVehicleID = async (vehicleId: Types.ObjectId, calculation: boolean) => {
    try {
        await dbConnect();
        console.log("--------------------------/n")
        console.log("Ovde sam");
        console.log("/n/n/n/n/n/n/n/n/n/n/n/n/n/n/n/n/n");
        if (!calculation) {
            console.log("ALI SAD SAM OVDEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEee");
            const fuelLogs1 = await FuelLog.find({ vehicleId }).limit(10);
            return fuelLogs1;
        } else {
            const fuelLogs = await FuelLog.find({ vehicleId });
            return fuelLogs;
        }

    } catch (err) {
        console.log(err);
        handleError(err, "api");
    }
}



export const saveFuelLogToDB = async ({ vehicleId, odometer, fuelAmount, price, date, average_consumption }: IFuelLog) => {
    try {
        await dbConnect();

        const newFuelLog = await FuelLog.create({
            vehicleId,
            odometer,
            average_consumption,
            fuelAmount,
            price,
            date
        });
    } catch (err) {
        handleError(err, "api");
    }
}


export const getUserByClerkId = async (clerkId: string) => {
    try {
        const mongoID = await User.findOne({ username: clerkId });
        return mongoID;
    } catch (err) {
        console.error(err);
        handleError(err, "api");
    }
}




