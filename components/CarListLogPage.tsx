import { LogPageVehicle } from '@/app/(root)/log/page'
import { CarType } from '@/types/car'
import { Car } from 'lucide-react'
import React from 'react'

interface CarListLogPageProps{
    vehicles:LogPageVehicle[],
    setActiveVehicle:React.Dispatch<React.SetStateAction<LogPageVehicle>>,
    activeVehicle:LogPageVehicle,
}

const CarListLogPage = ({vehicles, setActiveVehicle, activeVehicle}:CarListLogPageProps) => {
  return (
    <div className='flex gap-2'>
        {vehicles.map((vehicle) => (<div key={vehicle.name} onClick={() => setActiveVehicle(vehicle)} className={`cursor-pointer hover:border-black p-4 border-1 rounded-xl shadow-sm flex gap-2  ${activeVehicle.name === vehicle.name ? 'bg-[#171717] text-white font-semibold border-black' : 'text-gray-500 border-gray-200 bg-gray-50'}`}>
          <Car />
          {vehicle.name}
        </div>))}
      </div>
  )
}

export default CarListLogPage