import Navbar from '@/components/shared/Navbar'
import { AppUserProvider } from '@/context/AppUserContext'
import { SignedIn, UserButton } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='min-h-[100svh] flex flex-col bg-white border-blue-500 border-2'>
            <SignedIn>

                <AppUserProvider>
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
                    {/* <Navbar activeTab={"Home"} /> */}
                </AppUserProvider>
            </SignedIn>
        </div>
    )
}

export default layout