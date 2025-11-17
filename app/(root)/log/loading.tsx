import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
      <div className='flex flex-col mb-[30%] md:mb-[5%]'>
          <div className='pt-5'>
              <p className='text-lg font-bold'>Fuel Log</p>
          </div>
          <div className='flex flex-col gap-4'>
              <div className='flex gap-4'>
                  <Skeleton className="h-[50px] w-[120px]" />
                  <Skeleton className="h-[50px] w-[120px]" />
                  <Skeleton className="h-[50px] w-[120px]" />
              </div>

              <Skeleton className="h-[70px] w-full" />
              <Skeleton className="h-[200px] w-full" />
          </div>
      </div>
  )
}

export default loading