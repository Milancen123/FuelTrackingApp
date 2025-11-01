"use client"
import React, { useEffect, useState } from 'react'
import { CalendarIcon, Car, DollarSign, Fuel, Gauge, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Calendar } from "@/components/ui/calendar"
import { Check } from 'lucide-react';
import { format } from "date-fns";
import { LoaderCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CarType } from '@/types/car';
import { toast } from 'sonner';
import axios from 'axios';



interface FuelEntryProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    activeVehicle: string;
    setActiveVehicle: React.Dispatch<React.SetStateAction<CarType | undefined>>;
    vehicles: CarType[] | undefined;
    odometer_last_reading: number;
    setVehicles:React.Dispatch<React.SetStateAction<CarType[]|undefined>>;
}




const FuelEntry = ({ isOpen, setIsOpen, activeVehicle, setActiveVehicle, vehicles, odometer_last_reading, setVehicles }: FuelEntryProps) => {
    const [step, setStep] = useState(1);
    const [date, setDate] = React.useState<Date>(() => new Date());
    const [activeVehicleForFuel, setActiveVehicleForFuel] = useState<CarType | undefined>(vehicles && vehicles.find((car) => car.name === activeVehicle));
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState({
        vehicle: activeVehicleForFuel,
        odometer: "",
        fuelFilled: 0.0,
        totalPrice: 0.0,
        date: new Date().toString(),
    });


    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

    };


    const handleNextStep = () => {
        if (step > 5) return setStep(1);
        if (step === 2) {
            if (!formData.odometer) {
                setErrors({ odometer: "Please enter a value for the odometer." });
                return;
            } else if (Number.isNaN(Number(formData.odometer))) {
                setErrors({ odometer: "Only numeric values are allowed." });
                return;
            } else if (Number(formData.odometer) <= Number(activeVehicleForFuel?.odometer)) {
                setErrors({ odometer: "Odometer reading cannot be less than or equal to the previous recorded value." });
                return;
            }
            setErrors({});
        }
        if (step === 3) {
            if (!formData.fuelFilled) {
                setErrors({ fuelFilled: "Please enter a value for the fuel." });
                return;
            } else if (Number.isNaN(Number(formData.fuelFilled))) {
                setErrors({ fuelFilled: "Only numeric values are allowed." });
                return;
            } else if (Number(formData.fuelFilled) <= 0) {
                setErrors({ fuelFilled: "Fuel amount cannot be less than or equal to zero" });
                return;
            }
            setErrors({});
        }
        if (step === 4) {
            if (!formData.totalPrice) {
                setErrors({ totalPrice: "Please enter a value for the total price" });
                return;
            } else if (Number.isNaN(Number(formData.totalPrice))) {
                setErrors({ totalPrice: "Only numeric values are allowed." });
                return;
            } else if (Number(formData.totalPrice) <= 0) {
                setErrors({ totalPrice: "Total price cannot be less than or equal to zero" });
                return;
            }
            setErrors({});
        }
        setStep((prev) => prev + 1);
    }


    const handleBackStep = () => {
        if (step <= 1) return setStep(1);
        setStep((prev) => prev - 1);
    }

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            console.log("THIS IS DATA");
            console.log(formData);
            const res = await axios.post("/api/fuel", formData);
            console.log("✅ Saved vehicle:", res.data);
            toast.success("Fuel log has been created successfully");
            if(activeVehicleForFuel){
                setVehicles(prev =>{
                    if (!prev) return [];
                    return prev.map(v => {
                        console.log("1. OVDE--------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                        if (v.id !== activeVehicleForFuel.id) return v;
                        console.log("2. OVDE--------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                        return {
                            ...v,
                            last_fill_up: Number(formData.fuelFilled),
                            odometer: Number(formData.odometer),
                            active:false,
                            fuelData: [
                                {
                                    fuel_filled: Number(formData.fuelFilled),
                                    date: new Date(formData.date),
                                    total_price: Number(formData.totalPrice),
                                    odometer: Number(formData.odometer),
                                },
                                ...(v?.fuelData ?? [])
                            ]
                        };
                    })
                });
            }
            setSubmitting(false);
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to save vehicle");
        }
    }


    useEffect(() => {
        handleChange("date", date.toString());
    }, [date]);

    useEffect(() => {
        //@ts-expect-error expected
        handleChange("vehicle", (activeVehicleForFuel.id));
        console.log(activeVehicleForFuel);
    }, [activeVehicleForFuel]);



    if (!isOpen) {
        return;
    }


    return (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center sm:items-center justify-center p-0 sm:p-4'>
            <div className='md:w-[35%] md:min-w-[500px] w-[85%] bg-white shadow-xl rounded-xl p-4 flex flex-col gap-10'>
                <div className='flex justify-between items-center border-b-1 pb-3'>
                    <div>
                        <h1 className='font-bold text-xl'>Add Fuel Entry</h1>
                        <p className='text-gray-500'>Step {step} of 5</p>
                    </div>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className='hover:bg-gray-200 transition-all cursor-pointer p-1 rounded-lg' onClick={() => setIsOpen(false)}>
                                <X />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Close</p>
                        </TooltipContent>
                    </Tooltip>

                </div>

                {/* steps */}
                <div className='flex gap-3'>
                    {[1, 2, 3, 4, 5].map((stepNumber) => {
                        return <div key={stepNumber} className={`${stepNumber <= step ? 'bg-[#171717]' : 'bg-[#F5F5F5]'} w-full h-2 rounded-full`}>
                        </div>
                    })}
                </div>

                {step === 1 && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <Car size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Select vehicle</h1>
                            <p className='text-gray-500'>Which vehicle are you refueling?</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2 '>
                            {vehicles && vehicles.map((vehicle) => (
                                <div key={vehicle.name} className={`cursor-pointer flex w-full justify-between items-center p-2 border-1 border-gray-300 rounded-xl ${activeVehicleForFuel && activeVehicleForFuel.name === vehicle.name && 'bg-gray-100 transition-all'}`} onClick={() => { setActiveVehicleForFuel(vehicle) }}>
                                    <div className='flex items-center gap-2'>
                                        <div className='p-2 flex justify-center items-center bg-gray-200 rounded-lg'>
                                            <Car />
                                        </div>
                                        <h1>{vehicle.name}</h1>
                                    </div>

                                    {(activeVehicleForFuel && activeVehicleForFuel.name === vehicle.name) && (<Check />)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {step === 2 && (
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
                            <Input className={`p-6 text-center  ${errors.odometer ? 'text-red-500 font-bold' : 'text-black'}`} placeholder='45892' value={formData.odometer !== '0' ? formData.odometer : ''} onChange={(e) => handleChange("odometer", e.target.value)} />
                            {errors && (<p className='text-xs text-red-500 font-semibold text-center'>{errors.odometer}</p>)}
                            <p className='text-xs text-gray-500 text-center'>Last reading: {activeVehicleForFuel && activeVehicleForFuel.odometer}km</p>
                        </div>
                    </div>
                )}
                {step === 3 && (
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
                            <Input className='p-6 text-center' required placeholder='45.2' value={formData.fuelFilled !== 0 ? formData.fuelFilled : ''} onChange={(e) => handleChange("fuelFilled", e.target.value)} />
                            {errors && (<p className='text-xs text-red-500 font-semibold text-center'>{errors.fuelFilled}</p>)}
                        </div>
                    </div>
                )}
                {step === 4 && (
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
                            {errors && (<p className='text-xs text-red-500 font-semibold text-center'>{errors.totalPrice}</p>)}
                            <p className='text-xs text-gray-500 text-center'>Price per liter: {!Number.isNaN((Number(formData.totalPrice) / Number(formData.fuelFilled))) ? (Number(formData.totalPrice) / Number(formData.fuelFilled)).toFixed(2) : 0}EUR</p>
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
                                    <Calendar required mode="single" selected={date} onSelect={setDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}
                {step === 5 && (
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
                                <h1 className='text-black font-semibold text-sm'>{activeVehicleForFuel && activeVehicleForFuel.name}</h1>
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
                    <Button className='w-[48%] cursor-pointer bg-white text-black border-1 border-gray-400 hover:text-white' disabled={step === 1 || submitting} onClick={handleBackStep}>Back</Button>
                    {step < 5 && <Button className='w-[48%] cursor-pointer' onClick={() => handleNextStep()} >Next</Button>}
                    {step === 5 && <Button className={`w-[48%] cursor-pointer ${submitting && 'bg-gray-800'}`} disabled={submitting} onClick={() => handleSubmit()}>{submitting ? <><LoaderCircle className='animate-spin' /> Saving</> : <><Check /> Confirm</>}</Button>}
                </div>
            </div>
        </div>
    )
}

export default FuelEntry