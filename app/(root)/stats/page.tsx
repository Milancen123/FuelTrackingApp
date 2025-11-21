import React from 'react'
import { LogPageVehicle } from '../log/page';
import { CarType } from '@/types/car';
import getAppUser from '@/lib/auth/getAppUser';
import { redirect } from 'next/navigation';
import DateRangeSelector from '@/components/Stats/DateRangeSelector';
import StatsPage from '@/components/Stats/StatsPage';
import { getFuelLogsForVehicleID } from '@/app/database';
import mongoose from "mongoose";
import { FuelLogCardProps } from '@/components/FuelLogCard';
import { generateFuelAnalyticsData } from '@/lib/utils';


const page = async () => {
  //1. we will fetch vehicles for the signedin user
  //2. display all the vehicles
  //3. make the component for filtering data all data, last 30 days, last 7 days, last 60 days and custom range
  //4. make the diagrams
   const auth = await getAppUser();

  if(!auth || !auth.clerkId || !auth.mongoId) redirect("/");
  console.log(auth);
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

  const raw = await getFuelLogsForVehicleID(new mongoose.Types.ObjectId(vehicles[0].id), true);
  if(!raw) return;
  const fuelLogs:FuelLogCardProps[] = raw.map(fuelLog=> {
    return {
      id:fuelLog._id.toString(),
      date:new Date(fuelLog.date),
      totalPrice:fuelLog.price,
      pricePerLiter:fuelLog.fuelAmount / fuelLog.price,
      volume:fuelLog.fuelAmount,
      odometer:fuelLog.odometer,
    }
  })
  
  const mapped = fuelLogs.map((item, index) => {
    const previous = fuelLogs[index - 1];
      const localDate = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, "0")}-${String(item.date.getDate()).padStart(2, "0")}`;
    return {
      date: localDate,
      Fuel: item.volume,
      Distance: previous ? item.odometer - previous.odometer : 0,
      TotalCost: item.totalPrice,
    };
  });

  const {fuelPriceTrend, odometerProgression, monthlySpending} = generateFuelAnalyticsData(fuelLogs);

  // ai insights
  const res = await fetch("http://localhost:3000/api/aiInsights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fuelLogs }),
  });

  const data = await res.json();
  console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*-*-*-");
  const cleaned = data.raw.replace(/```json\s*|```/g, "").trim();
  const extracted = JSON.parse(cleaned);
  console.log(extracted);
  //console.log(data.recommendations);
  console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*-*-*-")

  console.log("ovo je mapirano", mapped);
  return (
    <div className='flex flex-col mb-[30%] md:mb-[5%]'>
      <div className='pt-5'>
          <p className='text-lg font-bold'>Statistics</p>
      </div>
      <StatsPage allVehicles={vehicles} fuelLogs={fuelLogs} vehicleStats={{}} interactiveBarChart={mapped} fuelPriceTrend={fuelPriceTrend} odometerProgression={odometerProgression} monthlySpending={monthlySpending} insights={extracted}/>
    </div>
  )
}

export default page