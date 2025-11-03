import { Fuel } from 'lucide-react'
import React from 'react'

interface FuelCardProp {
    fuel_filled: number,
    date: Date,
    total_price: number,
    average_consumption: number
}

const FuelCard = ({ fuel_filled, date, total_price, average_consumption }: FuelCardProp) => {
    return (
        <div className=' flex  justify-between items-center p-4 rounded-xl border-1 shadow-sm border-gray-200'>
            <div className='flex items-center gap-2 '>
                <div className=' bg-gray-300 p-1 rounded-md'>
                    <Fuel />
                </div>
                <div className='flex flex-col leading-tight'>
                    <h1 className='text-lg font-semibold m-0'>{fuel_filled}L</h1>
                    <p className='text-sm text-gray-700'>{date.toDateString()}</p>
                </div>
            </div>
            <div>
                <div className='flex flex-col leading-tight items-center'>
                    <h1 className='text-lg font-semibold m-0 self-end'>${total_price}</h1>
                    <p className='text-sm text-gray-700 self-end'>{average_consumption === 0 ? <span className='font-semibold text-red-700'>Reference Value</span> : `${average_consumption.toFixed(2)}L/100km`}</p>
                </div>
            </div>
        </div>
    )
}

export default FuelCard