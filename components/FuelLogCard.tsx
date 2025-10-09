import { Fuel } from 'lucide-react'
import React from 'react'
import { format } from "date-fns";

interface FuelLogCardProps{
  date:Date,
  totalPrice: number,
  pricePerLiter:number,
  volume:number,
  odometer:number
}

const FuelLogCard = ({date, totalPrice, pricePerLiter, volume, odometer} : FuelLogCardProps) => {
  return (
    <div className='p-4 border-1 border-gray-300 rounded-xl shadow-sm'>
      <div className='flex justify-between border-b-1 border-b-gray-300 pb-4'>
        <div className='flex gap-2 items-center'>
          <div className='p-2 bg-gray-100 rounded-lg'>
            <Fuel />
          </div>
          <h1 className='text-sm'>{format(date, "PPP")}</h1>
        </div>
        <div>
          <h1 className='text-xl font-bold'>${totalPrice}</h1>
          <p className='text-sm text-gray-500 text-right'>${pricePerLiter.toFixed(2)}/l</p>
        </div>
      </div>
      <div className='flex gap-4 md:gap-30 pt-4'>
        <div>
          <h1 className='text-gray-500 text-sm'>Volume</h1>
          <h1 className='text-md font-semibold'>{volume} L</h1>
        </div>
        <div>
          <h1 className='text-gray-500 text-sm'>Odometer</h1>
          <h1 className='text-md font-semibold'>{odometer} km</h1>
        </div>
        
      </div>
    </div>
  )
}

export default FuelLogCard