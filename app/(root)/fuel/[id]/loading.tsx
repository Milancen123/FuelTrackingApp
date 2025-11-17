import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { LoaderCircle } from 'lucide-react'


const loading = () => {
  return (
    <div className='flex flex-col justify-center text-md items-center md:h-[100%] h-[80%] bg-white gap-5 md:mb-[5%] mb-[15%] mt-[5%] overflow-y-scroll'>
        <LoaderCircle className='animate-spin' size={40}/>
    </div>
  )
}

export default loading