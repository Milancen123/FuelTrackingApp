import { model, models, Schema, Document, Types } from "mongoose";

export interface IFuelLog {
  vehicleId:Types.ObjectId,
  odometer: number;
  average_consumption?:number,
  fuelAmount: number;
  price: number;
  date: Date;
  fullTank:boolean;
}

const FuelLogSchema = new Schema<IFuelLog>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    odometer: { type: Number, required: true },
    average_consumption:{type:Number, required:false},
    fuelAmount: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    fullTank:{type:Boolean, required:true},
  },
  {
    timestamps: true,
  }
);

const FuelLog = models.FuelLog || model<IFuelLog>("FuelLog", FuelLogSchema);

export default FuelLog;
