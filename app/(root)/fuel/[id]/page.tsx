
import { getFuelLogById } from '@/app/database'
import FuelLogEdit from '@/components/FuelLogEdit'
import React from 'react'
import mongoose from "mongoose";
import { redirect } from "next/navigation";


interface LogPageProps {
  params: { id: string };
}

export interface IFuelLogUpdate{
    id:string,
    vehicleId:string,
    odometer:number,
    fuelAmount:number,
    price:number,
    fullTank:boolean,
    date:Date,
    previousOdometer:number,
    previousDate:Date,
}

const page = async ({ params }: LogPageProps) => {

    const { id } = params;
    console.log("\n\n\n\n\n\n\n***********************************************SERVER***********************************************\n\n\n\n\n\n\n");
    console.log("OVAJ ID SMO DOBILI ZA FUELLOG: ", id);
    const data = await getFuelLogById(new mongoose.Types.ObjectId(id));

    if(!data){
        redirect("/log");
    }
    const current = data.current;
    const previous = data.previous;
    
    console.log("OVO JE DATA KOJI SMO DOBILI ZA TAJ FUEL LOG")
    console.log(current);
    console.log(previous);

    const previousDate = Array.isArray(previous)
        ? previous[0]?.date ?? new Date("2000-01-01")
        : previous?.date ?? new Date("2000-01-01");

    const previousOdometer = Array.isArray(previous)
        ? previous[0]?.odometer ?? 0
        : previous?.odometer ?? 0;

        
    const formattedFuelLog:IFuelLogUpdate = {
        id:(current._id).toString(),
        vehicleId:(current.vehicleId).toString(),
        odometer:current.odometer,
        fuelAmount:current.fuelAmount,
        price:current.price,
        fullTank:current.fullTank,
        date:current.date,
        previousOdometer,
        previousDate,
    };

    return (
        <div className=' flex flex-col justify-center text-md items-center md:h-[100%] h-[80%] bg-white gap-5 md:mb-[5%] mb-[15%] mt-[5%] overflow-auto'>
            <h1 className='md:text-xl text-md font-bold'>Update your record</h1>
            <FuelLogEdit id={(formattedFuelLog.id)} vehicleId={formattedFuelLog.vehicleId} odometer={formattedFuelLog.odometer} fuelAmount={formattedFuelLog.fuelAmount} price={formattedFuelLog.price} fullTank={formattedFuelLog.fullTank} date={formattedFuelLog.date} previousOdometer={formattedFuelLog.previousOdometer} previousDate={new Date(formattedFuelLog.previousDate)}/>
        </div>
    )
}

export default page