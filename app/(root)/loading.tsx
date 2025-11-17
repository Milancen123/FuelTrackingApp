import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
    return (
        <div className='bg-white flex flex-col gap-5 md:mb-[5%] mb-[15%]'>
            <div className='flex flex-col gap-4'>
                <div className='pt-5 flex flex-col gap-4'>
                    <p className='text-lg font-bold'>My Vehicles</p>
                    <div className='flex flex-col mt-5 gap-4 md:flex-row items-center'>
                        <Skeleton className='h-[180px] w-[350px]' />
                        <Skeleton className='h-[180px] w-[350px]' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <Skeleton className='w-full h-[180px]' />
                        <Skeleton className='w-full h-[180px]' />

                    </div>
                </div>
            </div>
            <Skeleton className="h-[50px] w-[120px]" />
        </div>
    )
}

export default loading