"use client";
import React, { useEffect, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CarType } from '@/types/car';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Car } from 'lucide-react';
import FuelLogCard from '@/components/FuelLogCard';
import dbConnect from '@/lib/mongoose';



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


const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleQuery = searchParams.get("vehicle");
  const defaultVehicle: string = vehicleQuery || allVehicles[0].name;



  //fetch available vehicles from the database
  const [activeVehicle, setActiveVehicle] = useState<CarType>(allVehicles.find((vehicle) => (vehicle.name === defaultVehicle)) || allVehicles[0]);
  const [vehicles, setVehicles] = useState<CarType[]>(allVehicles);
  const [fuelData, setFuelData] = useState(activeVehicle.fuelData);



  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('vehicle', activeVehicle.name);
    router.replace(`?${params.toString()}`);
    setFuelData(activeVehicle.fuelData);
  }, [activeVehicle]);







  return (
    <div className='flex flex-col gap-4 md:mb-[5%] mb-[20%]'>
      <div className='pt-5'>
        <p className='text-lg font-bold'>Fuel Log</p>
      </div>
      <div className='flex gap-2'>
        {vehicles.map((vehicle) => (<div key={vehicle.name} onClick={() => setActiveVehicle(vehicle)} className={`cursor-pointer hover:border-black p-4 border-1 rounded-xl shadow-sm flex gap-2  ${activeVehicle.name === vehicle.name ? 'bg-[#171717] text-white font-semibold border-black' : 'text-gray-500 border-gray-200 bg-gray-50'}`}>
          <Car />
          {vehicle.name}
        </div>))}
      </div>

      <div className='flex items-center justify-between w-full p-4 border-1 border-gray-300 rounded-xl shadow-sm'>
        <div className='w-full flex flex-col justify-center items-center'>
          <h1 className='text-sm text-gray-500'>Total Entries</h1>
          <h1 className='text-lg font-bold'>1024</h1>
        </div>
        <div className='w-full flex flex-col justify-center items-center'>
          <h1 className='text-sm text-gray-500'>Total Fuel</h1>
          <h1 className='text-lg font-bold'>1024l</h1>
        </div>
        <div className='w-full flex flex-col justify-center items-center'>
          <h1 className='text-sm text-gray-500'>Total Cost</h1>
          <h1 className='text-lg font-bold'>$ 1572</h1>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {activeVehicle.fuelData && activeVehicle.fuelData.map((fuelLog) => (
          <FuelLogCard key={`${fuelLog.date}+${fuelLog.total_price}`} date={fuelLog.date} totalPrice={fuelLog.total_price} pricePerLiter={(Number(fuelLog.total_price) / Number(fuelLog.fuel_filled))} volume={fuelLog.fuel_filled} odometer={fuelLog.odometer} />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Page