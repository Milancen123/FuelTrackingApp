"use client"
import React, { useEffect, useState } from 'react'
import { CalendarIcon, DollarSign, Fuel, Gauge, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Calendar } from "@/components/ui/calendar"
import { Check } from 'lucide-react';
import { format } from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"



interface FuelEntryProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    activeVehicle:string;
    odometer_last_reading:number;
}



const FuelEntry = ({ isOpen, setIsOpen,activeVehicle, odometer_last_reading }: FuelEntryProps) => {
    const [step, setStep] = useState(1);
    const [date, setDate] = React.useState<Date>(() => new Date())

    const [formData, setFormData] = useState({
        vehicle:activeVehicle,
        odometer: "",
        fuelFilled: 0.0,
        totalPrice: 0.0,
        date: new Date().toString(),
    });


    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

    };


    const handleNextStep = () => {
        if (step > 4) return setStep(1);
        console.log("Ovo je trenutni korak");
        console.log(step);
        console.log("Ovo su sada podaci u formi koji se nalaze--------------------");
        console.log(formData);
        setStep((prev) => prev + 1);
    }


    const handleBackStep = () => {
        if (step <= 1) return setStep(1);
        setStep((prev) => prev - 1);
    }

    const handleSubmit = () => {

    }


    useEffect(() => {
        handleChange("date", date.toString());
    }, [date]);


    if (!isOpen) {
        return;
    }


    return (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center sm:items-center justify-center p-0 sm:p-4'>
            <div className='md:w-[35%] md:min-w-[500px] w-[85%] bg-white shadow-xl rounded-xl p-4 flex flex-col gap-10'>
                <div className='flex justify-between items-center border-b-1 pb-3'>
                    <div>
                        <h1 className='font-bold text-xl'>Add Fuel Entry</h1>
                        <p className='text-gray-500'>Step {step} of 4</p>
                    </div>
                    <div className='hover:bg-gray-200 transition-all cursor-pointer p-1 rounded-lg' onClick={() => setIsOpen(false)}>
                        <X />
                    </div>
                </div>
                {/* steps */}
                <div className='flex gap-3'>
                    {[1, 2, 3, 4].map((stepNumber) => {
                        return <div key={stepNumber} className={`${stepNumber <= step ? 'bg-[#171717]' : 'bg-[#F5F5F5]'} w-full h-2 rounded-full`}>
                        </div>
                    })}
                </div>
                {step === 1 && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <Gauge size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Odometer Reading</h1>
                            <p className='text-gray-500'>Enter your current mileage</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2'>
                            <h1 className='font-semibold'>Current Odometer (km)</h1>
                            <Input className='p-6 text-center' placeholder='45892' value={formData.odometer !== '0' ? formData.odometer : ''} onChange={(e) => handleChange("odometer", e.target.value)} />
                            <p className='text-xs text-gray-500 text-center'>Last reading: {odometer_last_reading}km</p>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <Fuel size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Fuel Amount</h1>
                            <p className='text-gray-500'>How much fuel did you add?</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2'>
                            <h1 className='font-semibold'>Liters</h1>
                            <Input className='p-6 text-center' placeholder='45.2' value={formData.fuelFilled !== 0 ? formData.fuelFilled : ''} onChange={(e) => handleChange("fuelFilled", e.target.value)} />
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <DollarSign color="#517538" size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Price & Date</h1>
                            <p className='text-gray-500'>Enter the total cost and date</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2'>
                            <h1 className='font-semibold'>Total Price (EUR)</h1>
                            <Input className='p-6 text-center' placeholder='45.2' value={formData.totalPrice !== 0 ? formData.totalPrice : ''} onChange={(e) => handleChange("totalPrice", e.target.value)} />
                            <p className='text-xs text-gray-500 text-center'>Price per liter: {(Number(formData.totalPrice) / Number(formData.fuelFilled)).toFixed(2)}EUR</p>
                            <h1 className='font-semibold'>Date</h1>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!date}
                                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} />
                                </PopoverContent>
                            </Popover>
                            <p className='text-xs text-gray-500 text-center'>Price per liter: {(Number(formData.totalPrice) / Number(formData.fuelFilled)).toFixed(2)}EUR</p>
                        </div>
                    </div>
                )}
                {step === 4 && (
                    /*summary page*/
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <Check size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Review Entry</h1>
                            <p className='text-gray-500'>Please confirm your fuel entry</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2 p-2 rounded-xl bg-gray-50 text-sm border-1 border-gray-300'>
                            <div className='flex justify-between border-b-1 border-b-solid border-gray-300 p-4 '>
                                <h1 className='text-gray-500 text-sm'>Vehicle</h1>
                                <h1 className='text-black font-semibold text-sm'>{activeVehicle}</h1>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 '>
                                <h1 className='text-gray-500 text-sm'>Odometer</h1>
                                <h1 className='text-black font-semibold text-sm'>{formData.odometer}km</h1>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 '>
                                <h1 className='text-gray-500 text-sm'>Fuel Amount</h1>
                                <h1 className='text-black font-semibold text-sm'>{formData.fuelFilled}l</h1>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 '>
                                <h1 className='text-gray-500 text-sm'>Total Cost</h1>
                                <h1 className='text-black font-semibold text-sm'>{formData.totalPrice}EUR</h1>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 '>
                                <h1 className='text-gray-500 text-sm'>Date</h1>
                                <h1 className='text-black font-semibold text-sm'>{format(formData.date, "PPP")}</h1>
                            </div>
                        </div>
                    </div>
                )}
                <div className='w-full  justify-between flex gap-2'>
                    <Button className='w-[48%] cursor-pointer bg-white text-black border-1 border-gray-400 hover:text-white' disabled={step === 1} onClick={handleBackStep}>Back</Button>
                    {step < 4 && <Button className='w-[48%] cursor-pointer' onClick={() => handleNextStep()} >Next</Button>}
                    {step === 4 && <Button className='w-[48%] cursor-pointer' onClick={() => handleSubmit()}><Check/>Confirm</Button>}
                </div>
            </div>
        </div>
    )
}

export default FuelEntry