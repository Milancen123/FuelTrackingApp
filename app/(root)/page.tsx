import React from 'react'
import VehicleListAndFuelList from '@/components/VehicleListAndFuelList';
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';
import { CarType } from '@/types/car';
import getAppUser from '@/lib/auth/getAppUser';










const Page = async () => {


  const user = await getAppUser();
  if(!user) return;
  //here we can fetch all vehicles for the logged in user
  const responseForVehicles = await fetch(`${process.env.BASEURI}/api/vehicles?mongoID=${user.mongoId}`, {
    cache:"no-store",
  });
  const rawFormatVehicles = await responseForVehicles.json();
  console.log("---------------------------------------------------------------");
  console.log(rawFormatVehicles);
  const formattedVehicles:CarType[] = rawFormatVehicles.data.map((vehicle:CarType)=> {
    return {
      id: vehicle.id,
      name: vehicle.name,
      last_fill_up:vehicle.last_fill_up,
      odometer: Number(vehicle.odometer),
      active:false,
      fuelData:vehicle.fuelData,
    }
  })
  console.log("asdklf;jsdflkasjdflkasdj")
  console.log(formattedVehicles);


  return (
    <div className='bg-white flex flex-col gap-5 md:mb-[5%] mb-[15%]'>
      <VehicleListAndFuelList vehiclesProp={formattedVehicles}/>
    </div>
  )
}

export default Page