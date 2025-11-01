import FuelLog, { IFuelLog } from "@/database/fuelLog.model";
import User from "@/database/user.model";
import Vehicle, { IVehicle } from "@/database/vehicle.model";
import { handleError } from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { model, models, Schema, Types } from "mongoose";

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
       
        console.log(vehicles);
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

export const getFuelLogsForVehicleID = async (vehicleId: Types.ObjectId) => {
    try {
        await dbConnect();
        const fuelLogs = await FuelLog.find({ vehicleId }).limit(10);
        return fuelLogs;
    } catch (err) {
        console.log(err);
        handleError(err, "api");
    }
}



export const saveFuelLogToDB = async ({ vehicleId, odometer, fuelAmount, price, date }: IFuelLog) => {
    try {
        await dbConnect();

        const newFuelLog = await FuelLog.create({
            vehicleId,
            odometer,
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