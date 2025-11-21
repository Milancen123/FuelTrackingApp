"use client"
import React from 'react'
import { House } from 'lucide-react';
import { FileText } from 'lucide-react';
import { ChartColumn } from 'lucide-react';
import { Car } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    name: "Home",
    path: "/",
    icon: House
  },
  {
    name: "Log",
    path: "/log",
    icon: FileText
  },
  {
    name: "Stats",
    path: "/stats",
    icon: ChartColumn
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: Car
  }
]

interface NavbarProps {
  activeTab: string;
};


const Navbar = ({ activeTab }: NavbarProps) => {
  const pathname = usePathname();


  return (
    <div className='fixed bottom-0 inset-x-0 border-t border-gray-300 bg-white flex justify-between p-3 pb-[env(safe-area-inset-bottom)] text-gray-500 z-10'>
      {items.map((item) => {
        const Icon = item.icon;

        return <Link key={item.name} href={item.path}>
          <div key={item.name} className={`flex flex-col justify-center items-center ${pathname === item.path ? 'text-gray-900' : 'text-gray-400'} hover:text-gray-900 transition-all`}>
            <Icon />
            {item.name}
          </div>
        </Link>
      })}
    </div>
  )
}

export default Navbar