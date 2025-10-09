import Navbar from '@/components/shared/Navbar'
import React, { ReactNode } from 'react'

const layout = ({children}:{children:ReactNode}) => {
  return (
    <div>
        <header>
            <h1 className='text-xl text-black font-semibold'>Fuel Tracker</h1>
            <p className='text-lg text-gray-400'>Track your fuel consumption</p>
        </header>
        {children}
        <Navbar activeTab={"Home"}/>
    </div>
  )
}

export default layout