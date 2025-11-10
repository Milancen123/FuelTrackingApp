import React from 'react'
import { DropletOff } from 'lucide-react';

interface NoFuelProps {
  page?: string;
}

const NoFuel = ({ page }: NoFuelProps) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='p-4 text-[50px] flex justify-center items-center bg-gray-200 rounded-full'>
        <DropletOff />
      </div>
      {page?.toLowerCase() === "log" ? (
        <>
          <h1 className='text-2xl font-bold'>There is no fuel logs</h1>
        </>
      ) : (
        <>
          <h1 className='text-2xl font-bold'>No recent fuel entries</h1>
          <p className='text-gray-500'>Please add a fuel entry</p>
        </>
      )}

    </div>
  )
}

export default NoFuel