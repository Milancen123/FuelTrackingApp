
import { getFuelLogsByPage, getVehicles, getVehicleStats, IgetVehicleStats } from '@/app/database';
import { FuelLogCardProps } from '@/components/FuelLogCard';
import LogPage from '@/components/LogPage';
import getAppUser from '@/lib/auth/getAppUser';
import { compareMonthlyFuelCost, totalSpentThisMonth } from '@/lib/calculations/averagePrice';
import { CarType } from '@/types/car';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import mongoose from "mongoose";
import { CircleOff } from 'lucide-react';
import React from 'react'
import NoFuel from '@/components/NoFuel';
import { DropletOff } from 'lucide-react';
import Link from 'next/link';
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
  //get the vehicles data totalDistance, totalFuel, totalCost
  let vehicleStats:IgetVehicleStats = {
      totalDistance:0,
      totalFuel:0,
      totalCost:0,
  }

  let fuelLogs:FuelLogCardProps[] = [];
  if(vehicles.length > 0){
      vehicleStats = await getVehicleStats(new mongoose.Types.ObjectId(vehicles[0].id));
      fuelLogs = await getFuelLogsByPage(1, vehicles[0].id);
  }



  







  return (
    <div className='flex flex-col   h-dvh gap-4 md:mb-[5%] mb-[20%]'>
      <div className='pt-5'>
        <p className='text-lg font-bold'>Fuel Log</p>
      </div>
      <div className='flex flex-col justify-center '>
        {vehicles.length > 0 ? <LogPage allVehicles={vehicles} fuelLogs={fuelLogs || []} vehicleStats={vehicleStats}/> : <div className='flex flex-col items-center justify-center mt-[30%] md:mt-[10%]'>
          <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full'>
            <CircleOff />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <h1 className='text-2xl font-bold'>Please create new vehicle</h1>
            <Link
              href="/">
                <p className='text-gray-500 underline hover:no-underline hover:text-blue-400'>Go to the Home page and create new vehicle</p>
            </Link>
            
          </div>
        </div>}
      </div>
    </div>
  )
}

export default Page