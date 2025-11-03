import { model, models, Schema, Types } from "mongoose";

export interface IVehicle{
    userId: Types.ObjectId;
    make:string;
    model:string;
    year:number;
    fuelType:string;
    odometer:string;
    average_consumption?:number;
    compare_for_last_month_consumption?:number;
    monthly_cost?:number;
    compare_for_last_month_cost?:number;
}

const VehicleSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    make:{type:String, required:true},
    model:{type:String, required:true},
    year:{type:Number, required:true},
    fuelType:{type:String, required:true},
    odometer:{type:String, required:true},
    average_consumption:{type:Number, required:false},
    compare_for_last_month_consumption:{type:Number, required:false},
    monthly_cost:{type:Number, required:false},
    compare_for_last_month_cost:{type:Number, required:false},
},
{ strict: true } // ✅ ensures mongoose stores new fields//
);

const Vehicle = models.Vehicle || model<IVehicle>("Vehicle", VehicleSchema, "vehicles");





export default Vehicle;