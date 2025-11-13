"use client"
import React, { useEffect, useState } from 'react'
import { Calendar1, CalendarIcon, Car, DollarSign, Fuel, Gauge, List, X } from 'lucide-react';
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
import axios from "axios";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CarType } from '@/types/car';
import Select from 'react-select';
import { MakeAndModelsDB } from '@/lib/carMakeAndModels';
import { toast } from "sonner"
import { useAppUser } from '@/context/AppUserContext';


interface FuelEntryProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    activeVehicle: string;
    vehicles: CarType[] | undefined;
    odometer_last_reading: number;
}

interface VehicleEntryProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    vehicles:CarType[];
    setVehicles: React.Dispatch<React.SetStateAction<CarType[] | undefined>>;
}




const options = MakeAndModelsDB.map((make) => {
    return {
        value: make.name,
        label:make.name
    }
});

const currentYear = new Date().getFullYear();


const years = Array.from(
  { length: currentYear - 1999 + 1 },
  (_, i) => {
    const year = 1999 + i;
    return { value: String(year), label: String(year) };
  }
);

const fuelOptions = [
    {value:"Diesel", label:"Diesel"},
    {value:"Gasoline", label:"Gasoline"}
];

const VehicleEntry = ({ isOpen, setIsOpen, vehicles, setVehicles }: VehicleEntryProps) => {
    const { mongoId, loading } = useAppUser();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = React.useState<Date>(() => new Date());
    const [selectedMake, setSelectedMake] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedYear, setSelectedYear] = useState(1999);
    const [selectedFuel, setSelectedFuel] = useState("");


    const [models, setModels] = useState<{ value: string; label: string }[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: 0,
        fuelType: "",
        odometer: 0,
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

    };

    const handleNextStep = () => {
        if (step > 6) return setStep(1);
        // if (step === 2) {
        //     if (!formData.odometer) {
        //         setErrors({ odometer: "Please enter a value for the odometer." });
        //         return;
        //     } else if (Number.isNaN(Number(formData.odometer))) {
        //         setErrors({ odometer: "Only numeric values are allowed." });
        //         return;
        //     } else if (Number(formData.odometer) <= Number(activeVehicleForFuel?.odometer)) {
        //         setErrors({ odometer: "Odometer reading cannot be less than or equal to the previous recorded value." });
        //         return;
        //     }
        //     setErrors({});
        // }
        // if (step === 3) {
        //     if (!formData.fuelFilled) {
        //         setErrors({ fuelFilled: "Please enter a value for the fuel." });
        //         return;
        //     } else if (Number.isNaN(Number(formData.fuelFilled))) {
        //         setErrors({ fuelFilled: "Only numeric values are allowed." });
        //         return;
        //     } else if (Number(formData.fuelFilled) <= 0) {
        //         setErrors({ fuelFilled: "Fuel amount cannot be less than or equal to zero" });
        //         return;
        //     }
        //     setErrors({});
        // }
        // if (step === 4) {
        //     if (!formData.totalPrice) {
        //         setErrors({ totalPrice: "Please enter a value for the total price" });
        //         return;
        //     } else if (Number.isNaN(Number(formData.totalPrice))) {
        //         setErrors({ totalPrice: "Only numeric values are allowed." });
        //         return;
        //     } else if (Number(formData.totalPrice) <= 0) {
        //         setErrors({ totalPrice: "Total price cannot be less than or equal to zero" });
        //         return;
        //     }
        //     setErrors({});
        // }
        setStep((prev) => prev + 1);
    }

    const handleBackStep = () => {
        if (step <= 1) return setStep(1);
        setStep((prev) => prev - 1);
    }

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await axios.post("/api/vehicles", {mongoid:mongoId,...formData});
            console.log("✅ Saved vehicle:", res.data.response.vehicleId);
            const vehicleId = res.data.response.vehicleId;
            toast.success("Vehicle has been created successfully");
            //return id for vehicle here
            setVehicles([...vehicles, {id:vehicleId,name:`${formData.make} ${formData.model}`, odometer:Number(formData.odometer),active:false}]);
            setSubmitting(false);
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to save vehicle");
        }
    }



    useEffect(()=>{
        const foundMake = MakeAndModelsDB.find((make) => make.name === selectedMake);
        const models = foundMake ? foundMake.model : [];
        const formatted = models.map((model)=> {
            return {
                value:model,
                label:model
            }
        });
        setModels(formatted);
        console.log(models);
    }, [selectedMake])


    if (!isOpen) {
        return;
    }


    return (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center sm:items-center justify-center p-0 sm:p-4'>
            <div className='md:w-[35%] md:min-w-[500px] w-[85%] bg-white shadow-xl rounded-xl p-4 flex flex-col gap-10'>
                <div className='flex justify-between items-center border-b-1 pb-3'>
                    <div>
                        <h1 className='font-bold text-xl'>Add New Vehicle</h1>
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
                            <h1 className='text-2xl font-bold'>Select Vehicle make</h1>
                            <p className='text-gray-500'>Which vehicle are you driving?</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2 '>
                            <Select options={options} onChange={(newValue) => {setSelectedMake(newValue ? newValue.value : ''); handleChange("make", newValue ? newValue.value : "")}}/>
                        </div>

                    </div>
                )}

                {step === 2 && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <List size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Select model of {selectedMake}</h1>
                            <p className='text-gray-500'>Which model are you driving?</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2 '>
                            <Select options={models} onChange={(newValue) => {setSelectedModel(newValue ? newValue.value : ''); handleChange("model", newValue ? newValue.value : "")}}/>
                        </div>

                    </div>
                )}

                {step === 3 && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <Calendar1 size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Select Year of Manufacture</h1>
                            <p className='text-gray-500'>When was your vehicle built?</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2 '>
                            <Select options={years} onChange={(newValue) => {setSelectedYear(newValue ? Number(newValue.value) : -1); handleChange("year", newValue ? newValue.value : "")}}/>
                        </div>

                    </div>
                )}

                {step === 4 && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <Fuel size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Select Fuel</h1>
                            <p className='text-gray-500'>What fuel does your vehicle use?</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2 '>
                            <Select options={fuelOptions} onChange={(newValue) => {setSelectedFuel(newValue ? newValue.value : ""); handleChange("fuelType", newValue ? newValue.value : "")}} />
                        </div>

                    </div>
                )}

                {/* {step === 5 && (
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
                        </div>
                    </div>
                )} */}



                {step === 5 && (
                    /*summary page*/
                    <div className='flex flex-col items-center gap-4'>
                        <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full' >
                            <Check size={40} />
                        </div>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Review Entry</h1>
                            <p className='text-gray-500'>Please confirm your vehicle entry</p>
                        </div>
                        <div className='w-[80%] flex flex-col gap-2 p-2 rounded-xl bg-gray-50 text-sm border-1 border-gray-300'>
                            <div className='flex justify-between pl-4 pr-4'>
                                <h1 className='text-gray-500 text-sm'>Vehicle</h1>
                                <h1 className='text-black font-semibold text-sm'>{formData && formData.make}</h1>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 '>
                                <h1 className='text-gray-500 text-sm'>Model</h1>
                                <h1 className='text-black font-semibold text-sm'>{formData.model}</h1>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 '>
                                <h1 className='text-gray-500 text-sm'>Year of manufacture</h1>
                                <h1 className='text-black font-semibold text-sm'>{formData.year}</h1>
                            </div>
                            <div className='flex justify-between pl-4 pr-4 '>
                                <h1 className='text-gray-500 text-sm'>Fuel</h1>
                                <h1 className='text-black font-semibold text-sm'>{formData.fuelType}</h1>
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

export default VehicleEntry;