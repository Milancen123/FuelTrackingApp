import Navbar from '@/components/shared/Navbar'
import { SignedIn, UserButton } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <SignedIn>
            <div className='p-5'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-xl text-black font-semibold'>Fuel Tracker</h1>
                        <p className='text-lg text-gray-400'>Track your fuel consumption</p>
                    </div>
                    <UserButton />
                </div>
                {children}
            </div>
            <Navbar activeTab={"Home"} />
        </SignedIn>
    )
}

export default layout