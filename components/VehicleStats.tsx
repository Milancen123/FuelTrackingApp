import React from 'react'

interface VehicleStatsProps{
    totalDistance:number;
    totalFuel:number;
    totalCost:number;
}

const VehicleStats = ({totalDistance, totalFuel, totalCost}:VehicleStatsProps) => {
  return (
      <div className='flex items-center justify-between w-full p-4 border-1 border-gray-300 rounded-xl shadow-sm'>
          <div className='w-full flex flex-col justify-center items-center'>
              <h1 className='text-sm text-gray-500'>Total Distance</h1>
              <h1 className='text-lg font-bold'>{totalDistance.toFixed(1)}km</h1>
          </div>
          <div className='w-full flex flex-col justify-center items-center'>
              <h1 className='text-sm text-gray-500'>Total Fuel</h1>
              <h1 className='text-lg font-bold'>{totalFuel.toFixed(1)}l</h1>
          </div>
          <div className='w-full flex flex-col justify-center items-center'>
              <h1 className='text-sm text-gray-500'>Total Cost</h1>
              <h1 className='text-lg font-bold'>€{totalCost.toFixed(1)}</h1>
          </div>
      </div>
  )
}

export default VehicleStats