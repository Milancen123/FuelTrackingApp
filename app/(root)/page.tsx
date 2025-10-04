"use client";

import React, { useState } from 'react'
import CarCard from '@/components/CarCard';
import { Gauge } from 'lucide-react';
import { TrendingDown } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Card from '@/components/Card';





const vehicles = [
  {
    name: "Opel Vectra B",
    last_fill_up: 45.6,
    odometer: 199899,
    active: true
  },
  {
    name: "Citroen C4",
    last_fill_up: 45.6,
    odometer: 199899,
    active: false
  }
]


const Page = () => {
  const [activeVehicle, setActiveVehicle] = useState("Opel Vectra B");

  return (
    <div className='bg-white flex flex-col gap-5'>
      <div className='pt-5'>
        <p className='text-lg font-bold'>My Vehicles</p>
        <div className='hidden mt-5 gap-2 md:flex'>
          {vehicles.map((vehicle) => {
            return <div key={vehicle.name} onClick={()=>setActiveVehicle(vehicle.name)} className='max-w-[380px] min-w-[360px] '>
              <CarCard
              key={vehicle.name}
              name={vehicle.name}
              last_fill_up={vehicle.last_fill_up}
              odometer={vehicle.odometer}
              active={activeVehicle === vehicle.name}
            />
            </div>
          })}
        </div>
        <div className='flex md:hidden justify-center mt-5'>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {vehicles.map((vehicle, index) => {
                console.log(vehicle);
                return <CarouselItem key={index} onClick={()=>setActiveVehicle(vehicle.name)}>
                  <CarCard
                  name={vehicle.name}
                  last_fill_up={vehicle.last_fill_up}
                  odometer={vehicle.odometer}
                  active={activeVehicle === vehicle.name}
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
          data={7.8}
          stats={-3.0}
          />
          <Card
          title='Monthly Cost'
          type={"cost"}
          data={245.80}
          stats={12}
          />
      </div>
    </div>
  )
}

export default Page