import { model, models, Schema, Types } from "mongoose";

export interface IVehicle{
    userId: Types.ObjectId;
    make:string;
    model:string;
    year:number;
    fuelType:string;
    odometer:string;
}

const VehicleSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    make:{type:String, required:true},
    model:{type:String, required:true},
    year:{type:Number, required:true},
    fuelType:{type:String, required:true},
    odometer:{type:String, required:true}
});

const Vehicle = models.Vehicle || model<IVehicle>("Vehicle", VehicleSchema, "vehicles");





export default Vehicle;