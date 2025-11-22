import { Euro, Gauge, TrendingDown, TrendingUp } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import React from 'react'

interface CardProps {
    title: string,
    type: string,
    data: number,
    stats?: number
}

const Card = ({ title, type, data, stats }: CardProps) => {
    return (
        <div className='flex flex-col  p-4 gap-5 rounded-2xl w-full border-1 shadow-sm border-gray-200'>
            <div className='flex gap-2 text-sm items-center'>
                <div className='text-green-800 bg-gray-300 p-1 rounded-md'>
                    {type==="consumption" ? <Gauge /> : <Euro/>}
                </div>
                <p className='font-semibold text-gray-700'>{type==="consumption"? 'Avg Consumption':'Monthly Cost'}</p>
            </div>
            <div className='text-2xl font-bold'>
                <h1>{type==="consumption"? `${data.toFixed(2)}l/100km`:`€${data.toFixed(2)}`}</h1>
            </div>
            {stats &&
                <div className={`flex gap-1 ${(stats > 0 ? 'text-red-800' : 'text-green-600')}`}>
                    {
                        stats > 0 ? <TrendingUp /> : <TrendingDown />
                    }
                    <p>{stats > 0 && '+'}{type !== "consumption" && "€"}{stats.toFixed(2)}{type === "consumption" && "%"} from last month</p>

                </div>
            }

        </div>
    )
}

export default Card