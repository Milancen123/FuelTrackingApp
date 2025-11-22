"use client"
import React, { useState } from 'react'
import DateRangeSelector from './DateRangeSelector'
import { LogPageVehicle } from '@/app/(root)/log/page';
import { FuelLogCardProps } from '../FuelLogCard';
import { IgetVehicleStats } from '@/app/database';
import CarListLogPage from '../shared/CarListLogPage';
import { BarChartInteractive } from './BarChartInteractive';
import { LineChartDots } from './LineChartDots';
import { ChartBarDefault } from './ChartBarDefault';
import { TriangleAlert } from 'lucide-react';
import { Lightbulb } from 'lucide-react';

export interface InteractiveBarChart {
  date: string;
  Fuel: number;
  Distance: number;
  TotalCost: number;
}

export interface FuelPriceTrend {
  date: string;
  price: number;
}

export interface OdometerProgression {
  date: string;
  km: number;
}

export interface MonthlySpending {
  month: string;
  cost: number;
}

interface Insights {
  anomalies: string[],
  recommendations: string[],
}

export interface FuelConsumptionPeaksI {
  date: string,
  avgCons: number,
}


export interface StatsPageProps {
  allVehicles: LogPageVehicle[];         // array of vehicles
  fuelLogs: FuelLogCardProps[];         // array of fuel logs
  vehicleStats: IgetVehicleStats | object;       // stats for selected vehicle
  interactiveBarChart: InteractiveBarChart[]; // your chart data
  fuelPriceTrend: FuelPriceTrend[];     // generated trend data
  odometerProgression: OdometerProgression[]; // generated odometer data
  monthlySpending: MonthlySpending[];   // monthly spending totals
  insights: Insights;
  fuelConsumptionPeaks: FuelConsumptionPeaksI[] | [];
}

export const fuelPriceTrend = [
  { date: "Jul 19", price: 1.18 },
  { date: "Jul 26", price: 1.18 },
  { date: "Aug 05 (1)", price: 1.67 },
  { date: "Aug 05 (2)", price: 1.66 },
  { date: "Aug 17", price: 1.63 },
  { date: "Sep 05", price: 1.65 },
  { date: "Sep 14 (1)", price: 1.65 },
  { date: "Sep 14 (2)", price: 1.16 },
  { date: "Sep 25", price: 1.66 },
  { date: "Oct 03", price: 1.66 },
  { date: "Oct 24", price: 1.63 },
  { date: "Oct 25", price: 1.08 },
  { date: "Oct 26 (1)", price: 1.64 },
  { date: "Oct 26 (2)", price: 1.09 },
  { date: "Nov 11", price: 1.15 },
]

export const odometerProgression = [
  { date: "Jul 19", km: 195330 },
  { date: "Jul 26", km: 195526 },
  { date: "Aug 05 (1)", km: 196576 },
  { date: "Aug 05 (2)", km: 196811 },
  { date: "Aug 17", km: 197510 },
  { date: "Sep 05", km: 197520 },
  { date: "Sep 14 (1)", km: 197530 },
  { date: "Sep 14 (2)", km: 197540 },
  { date: "Sep 25", km: 199335 },
  { date: "Oct 03", km: 199866 },
  { date: "Oct 24", km: 200439 },
  { date: "Oct 25", km: 200510 },
  { date: "Oct 26 (1)", km: 200928 },
  { date: "Oct 26 (2)", km: 200528 }, // out-of-order entry in your data
  { date: "Nov 11", km: 201554 },
]

export const monthlySpending = [
  { month: "July", cost: 71.5 },
  { month: "August", cost: 184.71 },
  { month: "September", cost: 130.17 },
  { month: "October", cost: 158.03 },
  { month: "November", cost: 41 },
]

// // return {
//   fuelPriceTrend,
//   odometerProgression,
//   monthlySpending,
// // };

const insights = {
  "anomalies": [
    "2025-09-25 → Odometer jumped 1795 km since previous refuel. This is unusually high compared to your typical 300–700 km intervals.",
    "2025-09-14 → Three refuels with only ~10 km between them. This suggests either incomplete refuels or incorrect odometer readings.",
    "2025-10-24 → FuelAmount = 3L. Extremely small refuel may break consumption calculations.",
    "2025-08-05 → Two refuels on the same day, resulting in abnormal consumption pattern.",
    "2025-09-05 → Consumption extremely low (23.25L for 10 km). Likely incorrect odometer or missing previous entry."
  ],
  "recommendations": [
    "Avoid very small refuels (under 5L) unless necessary — they create inaccurate consumption data.",
    "Review entries made on 2025-09-14 and 2025-09-05; consider merging or correcting odometer values.",
    "Check if your odometer was logged incorrectly near 2025-09-25 — distance seems unrealistic.",
    "If you refuel more than once per day, mark non-full tanks correctly to ensure accurate calculations.",
    "When fuel spikes or drops sharply, verify if the log matches real consumption — this may indicate a misread odometer or a potential vehicle issue."
  ]
}

const StatsPage = ({ allVehicles, fuelLogs, vehicleStats, interactiveBarChart, fuelPriceTrend, odometerProgression, monthlySpending, insights, fuelConsumptionPeaks }: StatsPageProps) => {
  const defaultVehicle: string = allVehicles[0].name;
  const [activeVehicle, setActiveVehicle] = useState<LogPageVehicle>(allVehicles.find((vehicle) => (vehicle.name === defaultVehicle)) || allVehicles[0]);
  const [vehicles, setVehicles] = useState<LogPageVehicle[]>(allVehicles);
  const [fuelData, setFuelData] = useState(fuelLogs);
  const [filter, setFilter] = useState<string>("");


  return (
    <div className='flex flex-col gap-4'>
      {/* 
      ______________________________
      |Avg consumption||
      |liter per km|Price per km|
      ------------------------------
      */}
      <CarListLogPage vehicles={vehicles} setActiveVehicle={setActiveVehicle} activeVehicle={activeVehicle} />
      {/* <DateRangeSelector setFilter={setFilter}/> */}
      <BarChartInteractive chartData={interactiveBarChart} />
      <div className='flex md:flex-row flex-col w-full gap-3'>
        <LineChartDots
          data={fuelPriceTrend}
          xKey="date"
          yKey="price"
          title="Fuel Price Trend"
          description="€/L over time"
          colorVar="--chart-2"
        />
        <LineChartDots
          data={odometerProgression}
          xKey="date"
          yKey="km"
          title="Odometer progression"
          description="km over time"
          colorVar="--chart-2"
        />
        <ChartBarDefault
          data={monthlySpending}
          xKey="month"
          yKey="cost"
          title="Monthly Fuel Spending"
          description="Total amount spent per month (€)"
          colorVar="--chart-2"
        />
      </div>


      {/* 
        That would be niec:
        Develop component that will graphically display avg consumption and spikes if any
          Develop function that will calculate the avg consumption between fill ups
          And graphically represent that data
        GIve overview why the spikes could occur (driving behaviour etc....)
        
      
      */}
      <div className='flex gap-4 md:flex-row flex-col'>
        {/* <div className='bg-red-200 p-4 rounded-xl shadow-xl flex flex-col w-full'>
          <div className='flex items-center gap-2'>
            <TriangleAlert color='#ff0000' />
            <h1 className='md:text-xl text-lg font-bold text-red-500'>AI detected anomalies</h1>
          </div>
          
          <div>
            <h1>dsalkfjaskldfjslakdfj</h1>
          </div>
        </div> */}

        <LineChartDots
          data={fuelConsumptionPeaks}
          xKey="date"
          yKey="avgCons"
          title="Fuel Consumption Trend Over Time"
          description="Graph showing average consumption over full tank cycles"
          colorVar="--chart-4"
          peakDetection={true}
        />
        <div className='flex flex-col w-[40%]'>
          <div className='bg-blue-200 p-4 rounded-xl shadow-xl flex flex-col w-full'>
            <div className='flex items-center gap-2'>
              <Lightbulb color='#0000ff' />
              <h1 className='text-xl font-bold text-blue-500'>AI recommendations</h1>
            </div>
            <ul>
              {insights.recommendations.map((recommendation) => {
                return <li key={recommendation} className='md:text-sm text-xs'>
                  <span className='text-xl font-bold'>- </span>{recommendation}
                </li>
              })}
            </ul>
          </div>

        </div>

      </div>
      {/* 
          osnovni podaci
          avg consumption for that vehicle
          0.02l/km and 0.5eur/km
          odometer progression line 
          consumption trend over time

        */}
    </div>
  )
}
export default StatsPage