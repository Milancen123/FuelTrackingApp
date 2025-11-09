"use client"
import { Fuel, Loader, LoaderCircle } from 'lucide-react'
import React, { useState } from 'react'
import { format } from "date-fns";
import { SquarePen } from 'lucide-react';
import { Trash } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface FuelLogCardProps {
  date: Date,
  totalPrice: number,
  pricePerLiter: number,
  volume: number,
  odometer: number
}

const FuelLogCard = ({ date, totalPrice, pricePerLiter, volume, odometer }: FuelLogCardProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDeleting = ()=>{
    setDeleting(true);
    /*
    1. pass fuel entry id to the props
    2. create api for deleting
    3. create db function for deleting
    4. update the fuellogs for the vehicle with some state to display the real time change
    5.
    
    */
  }
  
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
          <h1 className='text-xl font-bold'>€{totalPrice}</h1>
          <p className='text-sm text-gray-500 text-right'>${pricePerLiter.toFixed(2)}/l</p>
        </div>
      </div>
      <div className='flex gap-4 md:gap-30 pt-4 items-center justify-between'>
        <div className='flex gap-8'>
          <div className=''>
            <h1 className='text-gray-500 text-sm'>Volume</h1>
            <h1 className='text-md font-semibold'>{volume} l</h1>
          </div>
          <div className=''>
            <h1 className='text-gray-500 text-sm'>Odometer</h1>
            <h1 className='text-md font-semibold'>{odometer} km</h1>
          </div>
        </div>
        <div className='flex gap-4'>

          <Tooltip>
            <TooltipTrigger asChild>
              <SquarePen size={20} color="#006eff" />
            </TooltipTrigger>
            <TooltipContent>
              <Button>
                
              </Button>
              <p>Edit this fuel log</p>
            </TooltipContent>
          </Tooltip>


          
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog>
                <DialogTrigger className='bg-white hover:bg-gray-200 hover:cursor-pointer p-2 rounded-xl'>
                  <Trash size={20} color="#ff0000" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                   <div>
                    <Button className='bg-red-500 hover:bg-red-600 hover:cursor-pointer min-w-[160px] max-w-[160px]' disabled={deleting} onClick={handleDeleting}>
                      {deleting? <><LoaderCircle className='animate-spin' /> Deleting</> :"Delete this record"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete this fuel log</p>
            </TooltipContent>
          </Tooltip>
        </div>

      </div>
    </div>
  )
}

export default FuelLogCard