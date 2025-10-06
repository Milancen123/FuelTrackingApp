"use client";

import React, { useState } from 'react'
import CarCard from '@/components/CarCard';
import { Fuel, Gauge } from 'lucide-react';
import { TrendingDown } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Plus } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Card from '@/components/Card';
import FuelCard from '@/components/FuelCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car } from "@/types/car";
import FuelEntry from '@/components/FuelEntry';






const vehicles:Car[] = [
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
        average_consumption: 14.5,
      },
      {
        fuel_filled: 38.7,
        date: new Date("2025-01-28"),
        total_price: 3785,
        average_consumption: 13.8,
      },
      {
        fuel_filled: 52.1,
        date: new Date("2025-02-10"),
        total_price: 5170,
        average_consumption: 15.2,
      },
      {
        fuel_filled: 41.6,
        date: new Date("2025-02-24"),
        total_price: 4125,
        average_consumption: 14.1,
      },
      {
        fuel_filled: 47.3,
        date: new Date("2025-03-08"),
        total_price: 4680,
        average_consumption: 14.8,
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
        average_consumption: 14.5,
      },
      {
        fuel_filled: 38.7,
        date: new Date("2025-01-28"),
        total_price: 3785,
        average_consumption: 13.8,
      },
      {
        fuel_filled: 52.1,
        date: new Date("2025-02-10"),
        total_price: 5170,
        average_consumption: 15.2,
      },
      {
        fuel_filled: 41.6,
        date: new Date("2025-02-24"),
        total_price: 4125,
        average_consumption: 14.1,
      },
      {
        fuel_filled: 47.3,
        date: new Date("2025-03-08"),
        total_price: 4680,
        average_consumption: 14.8,
      },
    ]
  }
]




const Page = () => {
  const [activeVehicle, setActiveVehicle] = useState<Car>(vehicles[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-white flex flex-col gap-5 md:mb-[5%] mb-[15%]'>
      <div className='pt-5'>
        <p className='text-lg font-bold'>My Vehicles</p>
        <div className='hidden mt-5 gap-2 md:flex'>
          {vehicles.map((vehicle) => {
            return <div key={vehicle.name} onClick={() => setActiveVehicle(vehicle)} className='max-w-[380px] min-w-[360px] '>
              <CarCard
                key={vehicle.name}
                name={vehicle.name}
                last_fill_up={vehicle.last_fill_up}
                odometer={vehicle.odometer}
                active={activeVehicle.name === vehicle.name}
              />
            </div>
          })}
        </div>
        <div className='flex md:hidden justify-center mt-5'>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {vehicles.map((vehicle, index) => {
                console.log(vehicle);
                return <CarouselItem key={index} onClick={() => setActiveVehicle(vehicle)}>
                  <CarCard
                    name={vehicle.name}
                    last_fill_up={vehicle.last_fill_up}
                    odometer={vehicle.odometer}
                    active={activeVehicle.name === vehicle.name}
                  />
                </CarouselItem>
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

        </div>
      </div>
      <div className='flex flex-col md:flex-row gap-2'>
        <Card
          title='Avg Consumption'
          type={"consumption"}
          data={activeVehicle.average_consumption}
          stats={activeVehicle.compare_for_last_month_consumption}
        />
        <Card
          title='Monthly Cost'
          type={"cost"}
          data={activeVehicle.monthly_cost}
          stats={activeVehicle.compare_for_last_month_cost}
        />
      </div>
      <div>
        <div className='flex items-center justify-between pt-2 pb-2'>
          <p className='text-lg font-bold'>Recent Fill-ups</p>
          <Link href="/">
            <div className='flex gap-2 text-sm items-center font-semibold h-full hover:bg-gray-300 rounded-lg p-1 pl-2 cursor-pointer'>
              <p>View All</p>
              <ChevronRight />
            </div>
          </Link>
        </div>
        <div className='flex flex-col gap-2 mt-5'>
          {activeVehicle.fuelData.map((fuelEntry) => (
            <FuelCard
              key={`${fuelEntry.date} ${fuelEntry.fuel_filled}`}
              fuel_filled={fuelEntry.fuel_filled}
              date={fuelEntry.date}
              total_price={fuelEntry.total_price}
              average_consumption={fuelEntry.average_consumption}
            />
          ))}
        </div>
      </div>
      <div className="fixed bottom-20 right-4 sm:right-6 z-10">
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow hover:cursor-pointer" onClick={()=>setIsOpen(true)}>
          <Plus />
        </Button>
      </div>

      {isOpen && <FuelEntry isOpen={isOpen} setIsOpen={setIsOpen} activeVehicle={activeVehicle.name} odometer_last_reading={activeVehicle.odometer}/>}
    </div>
  )
}

export default Page