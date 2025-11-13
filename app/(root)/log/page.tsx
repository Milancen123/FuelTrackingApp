
import { getFuelLogsByPage, getVehicles, getVehicleStats, IgetVehicleStats } from '@/app/database';
import { FuelLogCardProps } from '@/components/FuelLogCard';
import LogPage from '@/components/LogPage';
import getAppUser from '@/lib/auth/getAppUser';
import { compareMonthlyFuelCost, totalSpentThisMonth } from '@/lib/calculations/averagePrice';
import { CarType } from '@/types/car';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import mongoose from "mongoose";

import React from 'react'
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
// import { CarType } from '@/types/car';
// import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';
// import { Car } from 'lucide-react';
// import FuelLogCard from '@/components/FuelLogCard';
// import dbConnect from '@/lib/mongoose';
// import VehicleStats from '@/components/VehicleStats';
// import CarListLogPage from '@/components/CarListLogPage';



const allVehicles: CarType[] = [
  {
    name: "Opel Vectra B",
    last_fill_up: 45.6,
    odometer: 199899,
    active: true,
    average_consumption: 7.8,
    compare_for_last_month_consumption: -3,
    monthly_cost: 245.8,
    compare_for_last_month_cost: 12,
    fuelData: [
      {
        fuel_filled: 45.2,
        date: new Date("2025-01-15"),
        total_price: 4320,
        odometer: 123123,
        average_consumption: 14.5,
        fullTank:true,
      },
      {
        fuel_filled: 38.7,
        date: new Date("2025-01-28"),
        total_price: 3785,
        odometer: 123123,
        average_consumption: 13.8,
        fullTank:true,
      },
      {
        fuel_filled: 52.1,
        date: new Date("2025-02-10"),
        total_price: 5170,
        odometer: 123123,
        average_consumption: 15.2,
        fullTank:true,
      },
      {
        fuel_filled: 41.6,
        date: new Date("2025-02-24"),
        total_price: 4125,
        odometer: 123123,
        average_consumption: 14.1,
        fullTank:true,
      },
      {
        fuel_filled: 47.3,
        date: new Date("2025-03-08"),
        total_price: 4680,
        odometer: 123123,
        average_consumption: 14.8,
        fullTank:true,
      },
    ]
  },
  {
    name: "Citroen C4",
    last_fill_up: 52.8,
    odometer: 78234,
    active: false,
    average_consumption: 6.0,
    compare_for_last_month_consumption: -0.3,
    monthly_cost: 450,
    compare_for_last_month_cost: 180,
    fuelData: [
      {
        fuel_filled: 45.2,
        date: new Date("2025-01-15"),
        total_price: 4320,
        odometer: 78900,
        average_consumption: 14.5,
        fullTank:true,
      },
      {
        fuel_filled: 38.7,
        date: new Date("2025-01-28"),
        total_price: 3785,
        odometer: 123123,
        average_consumption: 13.8,
        fullTank:true,
      },
      {
        fuel_filled: 52.1,
        date: new Date("2025-02-10"),
        total_price: 5170,
        odometer: 123123,
        average_consumption: 15.2,
        fullTank:true,
      },
      {
        fuel_filled: 41.6,
        date: new Date("2025-02-24"),
        total_price: 4125,
        odometer: 123123,
        average_consumption: 14.1,
        fullTank:true,
      },
      {
        fuel_filled: 47.3,
        date: new Date("2025-03-08"),
        total_price: 4680,
        odometer: 123123,
        average_consumption: 14.8,
        fullTank:true,
      },
    ]
  }
];

export interface LogPageVehicle{
  id:string,
  name:string,
}

const Page = async () => {
  const auth = await getAppUser();

  if(!auth || !auth.clerkId || !auth.mongoId) redirect("/");
  console.log(auth);
  // get the mongodb id from clerk id
  const vehicleResponse = await fetch(`${process.env.BASEURI}/api/vehicles?mongoID=${auth.mongoId}`, {
    cache:"no-store",
  });

  const rawFormatVehicles = await vehicleResponse.json();

  const vehicles:LogPageVehicle[] = rawFormatVehicles.data.map((vehicle: CarType) => {
      if (vehicle.fuelData) {
        return {
          id: vehicle.id,
          name: vehicle.name,
        }
      }else{
        return [];
      }
      
    });

  //fetch server side the fuel log for the first vehicle in the list
  const fuelLogs:FuelLogCardProps[] = await getFuelLogsByPage(1, vehicles[0].id);
  //get the vehicles data totalDistance, totalFuel, totalCost
  

  const vehicleStats:IgetVehicleStats = await getVehicleStats(new mongoose.Types.ObjectId(vehicles[0].id));
  







  return (
    <div className='flex flex-col gap-4 md:mb-[5%] mb-[20%]'>
      <div className='pt-5'>
        <p className='text-lg font-bold'>Fuel Log</p>
      </div>
      <LogPage allVehicles={vehicles} fuelLogs={fuelLogs || []} vehicleStats={vehicleStats}/>
    </div>
  )
}

export default Page