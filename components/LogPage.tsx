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
import { Car, LoaderCircle } from 'lucide-react';
import FuelLogCard, { FuelLogCardProps } from '@/components/FuelLogCard';
import dbConnect from '@/lib/mongoose';
import VehicleStats from '@/components/VehicleStats';
import { LogPageVehicle } from '@/app/(root)/log/page';
import NoFuel from './NoFuel';
import { Button } from './ui/button';
import { getVehicleStats, IgetVehicleStats } from '@/app/database';
import mongoose from "mongoose";
import CarListLogPage from './shared/CarListLogPage';


interface LogPageProps {
    allVehicles: LogPageVehicle[] | [],
    fuelLogs: FuelLogCardProps[] | [],
    vehicleStats:IgetVehicleStats,
}



const LogPage = ({ allVehicles, fuelLogs, vehicleStats}: LogPageProps) => {
    

    const defaultVehicle: string =  allVehicles[0].name;

    //fetch available vehicles from the database
    const [activeVehicle, setActiveVehicle] = useState<LogPageVehicle>(allVehicles.find((vehicle) => (vehicle.name === defaultVehicle)) || allVehicles[0]);
    const [vehicles, setVehicles] = useState<LogPageVehicle[]>(allVehicles);
    const [fuelData, setFuelData] = useState(fuelLogs);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStats, setLoadingStats] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    //totalDistance={vehicleStats.totalDistance} totalFuel={vehicleStats.totalFuel} totalCost={vehicleStats.totalCost}
    const [totalDistance, setTotalDistance] = useState<number>(vehicleStats.totalDistance);
    const [totalFuel, setTotalFuel] = useState<number>(vehicleStats.totalFuel);
    const [totalCost, setTotalCost] = useState<number>(vehicleStats.totalCost);


    async function fetchFuelLogs(newPage: number) {
        try {
            setLoading(true);


            const res = await fetch(`/api/fuelLogsPerPage?vehicleId=${activeVehicle.id}&page=${newPage}`, {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json();
            if (data.success) {
                setFuelData(data.response);
                setPage(newPage);
            }
        } catch (err) {
            console.error("Error fetching fuel logs:", err);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        
        (async () => {
            try{
                setLoadingStats(true)
                await fetchFuelLogs(page);
                const response = await fetch(`/api/vehicleStats/${activeVehicle.id}`);
                const data = await response.json();

                console.log(data);
                // const vehicleStats1:IgetVehicleStats = await getVehicleStats(new mongoose.Types.ObjectId(activeVehicle.id));
                setTotalDistance(data.response.totalDistance);
                setTotalCost(data.response.totalCost);
                setTotalFuel(data.response.totalFuel);
            }catch(err){
                console.error(err);
            }finally{
                setLoadingStats(false);
            }
            
        })();
        
        setFuelData([]);
    }, [activeVehicle]);


    return (
        <div className='flex flex-col gap-4'>
            <CarListLogPage vehicles={vehicles} setActiveVehicle={setActiveVehicle} activeVehicle={activeVehicle} />

            <VehicleStats totalDistance={totalDistance} totalFuel={totalFuel} totalCost={totalCost} loading={loadingStats}/>

            <div className='flex flex-col gap-2 justify-center items-center'>
                {loading ? (
                    <div className='p-10'>
                        <LoaderCircle className='animate-spin' />
                    </div>
                ) : (
                    <>
                        {fuelData && fuelData.map((fuelLog) => (
                            <FuelLogCard key={`${fuelLog.date}+${fuelLog.totalPrice}`} id={fuelLog.id} date={fuelLog.date} totalPrice={fuelLog.totalPrice} pricePerLiter={(Number(fuelLog.totalPrice) / Number(fuelLog.volume))} volume={fuelLog.volume} odometer={fuelLog.odometer} />
                        ))}
                        {(fuelData && fuelData.length <= 0) && (<NoFuel page="log" />)}
                    </>
                )}
                
            </div>
            <Pagination>
                <PaginationContent>
                    <button
                        disabled={page === 1 || loading}
                        onClick={() => fetchFuelLogs(page - 1)}
                        className={`px-3 py-1 rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        Previous
                    </button>
                    <PaginationItem>
                        <PaginationLink>
                            <span className="px-3 py-1 font-medium">
                                Page {page}
                            </span>
                        </PaginationLink>
                    </PaginationItem>
                    {fuelData.length > 0 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>  
                    )}
                    <PaginationItem>
                        <button
                            disabled={loading || fuelData.length <= 0 }
                            onClick={() => fetchFuelLogs(page + 1)}
                            className={`px-3 py-1 rounded hover:bg-gray-100 ${fuelData.length <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        >
                            Next
                        </button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default LogPage