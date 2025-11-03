import React from 'react'
import VehicleListAndFuelList from '@/components/VehicleListAndFuelList';
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';
import { CarType } from '@/types/car';
import getAppUser from '@/lib/auth/getAppUser';
import { compareLifetimeConsumption, totalAverageConsumption } from '@/lib/calculations/averageConsumption';
import { compareMonthlyFuelCost, totalSpentThisMonth } from '@/lib/calculations/averagePrice';










const Page = async () => {


  const user = await getAppUser();
  if(!user) return;
  //here we can fetch all vehicles for the logged in user
  const responseForVehicles = await fetch(`${process.env.BASEURI}/api/vehicles?mongoID=${user.mongoId}`, {
    cache:"no-store",
  });
  const rawFormatVehicles = await responseForVehicles.json();
 
  const formattedVehicles: CarType[] = rawFormatVehicles.data.map((vehicle: CarType) => {
    if (vehicle.fuelData) {
      const average_consumption = totalAverageConsumption(vehicle.fuelData ?? []);
      const compare_for_last_month_consumption = compareLifetimeConsumption(vehicle.fuelData ?? []);
      const monthly_cost = totalSpentThisMonth(vehicle.fuelData ?? []);
      const compare_for_last_month_cost = compareMonthlyFuelCost(vehicle.fuelData ?? []);
      return {
        id: vehicle.id,
        name: vehicle.name,
        last_fill_up: vehicle.last_fill_up,
        odometer: Number(vehicle.odometer),
        active: false,
        average_consumption,
        compare_for_last_month_consumption,
        monthly_cost,
        compare_for_last_month_cost,
        fuelData: vehicle.fuelData,
      }
    }else{
      return [];
    }
    
  });



  return (
    <div className='bg-white flex flex-col gap-5 md:mb-[5%] mb-[15%]'>
      <VehicleListAndFuelList vehiclesProp={formattedVehicles}/>
    </div>
  )
}

export default Page