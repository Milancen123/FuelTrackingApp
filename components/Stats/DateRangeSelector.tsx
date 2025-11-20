"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'

const buttonList = [
    {
        name:"All time"
    },
    {
        name: "Last 7 days",
    },
    {
        name: "Last 30 days"
    },
    {
        name: "Last 3 months"
    },
    {
        name: "This year"
    }
];


interface DateRangeSelectorProps{
    setFilter:React.Dispatch<React.SetStateAction<string>>;
}

const DateRangeSelector = ({setFilter}:DateRangeSelectorProps) => {
    const [active, setActive] = useState(buttonList[0].name);
    const handleClick = (btn: React.SetStateAction<string>)=>{
        setActive(btn);
        setFilter(btn);
    }

  return (
    <div className='flex gap-2 md:flex-row flex-wrap'>
        {buttonList.map((btn) => <Button key={btn.name} className={`hover:cursor-pointer bg-gray-200 text-gray-800 hover:text-white hover:bg-gray-800 ${active===btn.name && 'bg-gray-800 text-white'}`} onClick={()=>handleClick(btn.name)}>{btn.name}</Button>)}
    </div>
  )
}

export default DateRangeSelector