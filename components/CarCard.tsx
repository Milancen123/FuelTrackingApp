import React from 'react'
import { Fuel } from 'lucide-react';


interface CarCardProps{
    name:string;
    last_fill_up:number;
    odometer:number;
    active:boolean;
}

const CarCard = ({name, last_fill_up, odometer,active}:CarCardProps) => {
  return (
    <div className={`w-full h-full hover:cursor-pointer ${active ? 'bg-[#171717] text-white border-none' : 'bg-white border-1 border-gray-200 hover:border-gray-500 transition-border'}  shadow-sm p-4 rounded-2xl flex flex-col gap-10`}>
        <div className='flex w-full justify-between'>
            <div>
                {active ? (<p>Active</p>):<p>Inactive</p>}
                <h1 className='text-xl font-bold'>{name}</h1>
            </div>
            <div className={`${active ? 'bg-gray-600 text-white':'bg-gray-300 text-black'} flex justify-center items-center rounded-full w-10 h-10`}>
                <Fuel/>
            </div>
        </div>
        
        <div className='flex justify-between'>
            <div>
                <p className={`${active?'text-gray-400':'text-gray-500'}`}>Last Fill-up</p>
                <h1 className='text-xl font-bold'>{last_fill_up}l</h1>
            </div>
            <div>
                <p className={`${active?'text-gray-400':'text-gray-500'}`}>Odometer</p>
                <h1 className='text-xl font-bold'>{odometer}km</h1>
            </div>
        </div>
    </div>
  )
}

export default CarCard