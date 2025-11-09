"use client";

import React, { useEffect, useState } from 'react'
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
import { CarType } from "@/types/car";
import FuelEntry from '@/components/FuelEntry';
import VehicleEntry from '@/components/VehicleEntry';
import { handleError } from '@/lib/handlers/error';
import NoFuel from './NoFuel';



type VehicleListAndFuelListProps = {
  vehiclesProp: CarType[];
};

const VehicleListAndFuelList = ({vehiclesProp}:VehicleListAndFuelListProps) => {
    const [activeVehicle, setActiveVehicle] = useState<CarType | undefined>();
    const [vehicles, setVehicles] = useState<CarType[] | undefined>();
    const [isOpen, setIsOpen] = useState(false);
    const [isVehicleEntryOpen, setIsVehicleEntryOpen] = useState(false);

    useEffect(()=>{
        setVehicles(vehiclesProp);
        if(vehicles){
            setActiveVehicle(vehicles[0]);
        }else{
            console.log("Zasto ulazimo ovde");
            console.log(vehicles);
        }
        

    }, []);
    useEffect(() => {
        if (vehicles) {
            setActiveVehicle(vehicles[0]);
        } else {
            console.log("Zasto ulazimo ovde");
            console.log(vehicles);
        }

    }, [vehicles]);
    

   
    return (
        <div className='flex flex-col gap-4 border-red-600'>
            <div className='pt-5'>
                <p className='text-lg font-bold'>My Vehicles</p>


                <div className='hidden mt-5 gap-4 md:flex items-center'>
                    {vehicles && vehicles.map((vehicle) => {
                        return <div key={vehicle.name + vehicle.odometer} onClick={() => setActiveVehicle(vehicle)} className='max-w-[380px] min-w-[360px] '>
                            <CarCard
                                key={vehicle.name}
                                name={vehicle.name}
                                last_fill_up={vehicle.last_fill_up || 0 }
                                odometer={vehicle.odometer}
                                active={activeVehicle ? (activeVehicle.name === vehicle.name && activeVehicle.odometer === vehicle.odometer) : false}
                            />
                        </div>

                    })}
                    <div className="max-w-[380px] min-w-[360px] max-h-[200px] min-h-[175] flex justify-center items-center shadow-sm p-4 rounded-2xl bg-white border-1 border-gray-200  hover:border-gray-500 transition-border">
                        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow hover:cursor-pointer" onClick={() => setIsVehicleEntryOpen(true)}>
                            <Plus />
                        </Button>
                    </div>
                </div>
                <div className='flex md:hidden justify-center mt-5 gap-4' >
                    <Carousel className="w-full max-w-xs gap-4 flex">
                        <CarouselContent className='flex gap-4'>

                            {vehicles && vehicles.map((vehicle, index) => {
                                console.log(vehicle);
                                return <CarouselItem key={index} onClick={() => setActiveVehicle(vehicle)}>
                                    <CarCard
                                        name={vehicle.name}
                                        last_fill_up={vehicle.last_fill_up || 0}
                                        odometer={vehicle.odometer}
                                        active={activeVehicle ? activeVehicle.name === vehicle.name : false}
                                    />
                                </CarouselItem>
                            })}
                            <div className="max-w-[320px] min-w-[320px] max-h-[200px] min-h-[175] flex justify-center items-center shadow-sm  rounded-2xl bg-white border-1 border-gray-200  hover:border-gray-500 transition-border">
                                <Button size="lg" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow hover:cursor-pointer" onClick={() => setIsVehicleEntryOpen(true)}>
                                    <Plus />
                                </Button>
                            </div>
                        </CarouselContent>
                        
                    </Carousel>

                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-2'>
                <Card
                    title='Avg Consumption'
                    type={"consumption"}
                    data={activeVehicle?.average_consumption ?? 0}
                    stats={activeVehicle?.compare_for_last_month_consumption ?? 0}
                />
                <Card
                    title='Monthly Cost'
                    type={"cost"}
                    data={activeVehicle?.monthly_cost ?? 0}
                    stats={activeVehicle?.compare_for_last_month_cost ?? 0}
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
                <div className='flex flex-col gap-2 mt-5 md:mb-3 mb-8'>
                    {(activeVehicle && activeVehicle.fuelData) && activeVehicle.fuelData.map((fuelEntry) => (
                        <FuelCard
                            key={`${fuelEntry.date} ${fuelEntry.fuel_filled}`}
                            fuel_filled={fuelEntry.fuel_filled}
                            date={new Date(fuelEntry.date)}
                            total_price={fuelEntry.total_price}
                            average_consumption={fuelEntry?.average_consumption ?? 0} 
                        />
                    ))}
                    {!activeVehicle?.fuelData || (activeVehicle?.fuelData && activeVehicle?.fuelData.length <= 0) && (
                        <NoFuel/>
                    )}              
                </div>
            </div>
            <div className="fixed bottom-20 right-4 sm:right-6 z-10">
                <Button size="lg" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow hover:cursor-pointer" disabled={vehicles && vehicles?.length <= 0} onClick={() => setIsOpen(true)}>
                    <Plus />
                </Button>
            </div>
            
            {(isOpen && vehicles) && <FuelEntry isOpen={isOpen} setIsOpen={setIsOpen} activeVehicle={activeVehicle ? activeVehicle.name : vehicles[0].name} setActiveVehicle={setActiveVehicle} vehicles={vehicles} odometer_last_reading={activeVehicle ? activeVehicle.odometer : vehicles[0].odometer} setVehicles={setVehicles} />}
            {(isVehicleEntryOpen && vehicles) && <VehicleEntry isOpen={isVehicleEntryOpen} setIsOpen={setIsVehicleEntryOpen} vehicles={vehicles} setVehicles={setVehicles}/>}

        </div>
    )
}

export default VehicleListAndFuelList