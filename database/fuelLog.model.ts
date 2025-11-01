import { model, models, Schema, Document, Types } from "mongoose";

export interface IFuelLog {
  vehicleId:Types.ObjectId,
  odometer: number;
  fuelAmount: number;
  price: number;
  date: Date;
}

const FuelLogSchema = new Schema<IFuelLog>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    odometer: { type: Number, required: true },
    fuelAmount: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const FuelLog = models.FuelLog || model<IFuelLog>("FuelLog", FuelLogSchema);

export default FuelLog;
