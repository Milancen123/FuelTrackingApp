"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { InteractiveBarChart } from "./StatsPage"

export const description = "An interactive bar chart"
/*
const chartData = [
  { date: "2024-04-01", Fuel: 222, Distance: 150, TotalCost: 222 * 1.8 },
  { date: "2024-04-02", Fuel: 97, Distance: 180, TotalCost: 97 * 1.8 },
  { date: "2024-04-03", Fuel: 167, Distance: 120, TotalCost: 167 * 1.8 },
  { date: "2024-04-04", Fuel: 242, Distance: 260, TotalCost: 242 * 1.8 },
  { date: "2024-04-05", Fuel: 373, Distance: 290, TotalCost: 373 * 1.8 },
  { date: "2024-04-06", Fuel: 301, Distance: 340, TotalCost: 301 * 1.8 },
  { date: "2024-04-07", Fuel: 245, Distance: 180, TotalCost: 245 * 1.8 },
  { date: "2024-04-08", Fuel: 409, Distance: 320, TotalCost: 409 * 1.8 },
  { date: "2024-04-09", Fuel: 59, Distance: 110, TotalCost: 59 * 1.8 },
  { date: "2024-04-10", Fuel: 261, Distance: 190, TotalCost: 261 * 1.8 },
  { date: "2024-04-11", Fuel: 327, Distance: 350, TotalCost: 327 * 1.8 },
  { date: "2024-04-12", Fuel: 292, Distance: 210, TotalCost: 292 * 1.8 },
  { date: "2024-04-13", Fuel: 342, Distance: 380, TotalCost: 342 * 1.8 },
  { date: "2024-04-14", Fuel: 137, Distance: 220, TotalCost: 137 * 1.8 },
  { date: "2024-04-15", Fuel: 120, Distance: 170, TotalCost: 120 * 1.8 },
  { date: "2024-04-16", Fuel: 138, Distance: 190, TotalCost: 138 * 1.8 },
  { date: "2024-04-17", Fuel: 446, Distance: 360, TotalCost: 446 * 1.8 },
  { date: "2024-04-18", Fuel: 364, Distance: 410, TotalCost: 364 * 1.8 },
  { date: "2024-04-19", Fuel: 243, Distance: 180, TotalCost: 243 * 1.8 },
  { date: "2024-04-20", Fuel: 89, Distance: 150, TotalCost: 89 * 1.8 },
  { date: "2024-04-21", Fuel: 137, Distance: 200, TotalCost: 137 * 1.8 },
  { date: "2024-04-22", Fuel: 224, Distance: 170, TotalCost: 224 * 1.8 },
  { date: "2024-04-23", Fuel: 138, Distance: 230, TotalCost: 138 * 1.8 },
  { date: "2024-04-24", Fuel: 387, Distance: 290, TotalCost: 387 * 1.8 },
  { date: "2024-04-25", Fuel: 215, Distance: 250, TotalCost: 215 * 1.8 },
  { date: "2024-04-26", Fuel: 75, Distance: 130, TotalCost: 75 * 1.8 },
  { date: "2024-04-27", Fuel: 383, Distance: 420, TotalCost: 383 * 1.8 },
  { date: "2024-04-28", Fuel: 122, Distance: 180, TotalCost: 122 * 1.8 },
  { date: "2024-04-29", Fuel: 315, Distance: 240, TotalCost: 315 * 1.8 },
  { date: "2024-04-30", Fuel: 454, Distance: 380, TotalCost: 454 * 1.8 },
  { date: "2024-05-01", Fuel: 165, Distance: 220, TotalCost: 165 * 1.8 },
  { date: "2024-05-02", Fuel: 293, Distance: 310, TotalCost: 293 * 1.8 },
  { date: "2024-05-03", Fuel: 247, Distance: 190, TotalCost: 247 * 1.8 },
  { date: "2024-05-04", Fuel: 385, Distance: 420, TotalCost: 385 * 1.8 },
  { date: "2024-05-05", Fuel: 481, Distance: 390, TotalCost: 481 * 1.8 },
  { date: "2024-05-06", Fuel: 498, Distance: 520, TotalCost: 498 * 1.8 },
  { date: "2024-05-07", Fuel: 388, Distance: 300, TotalCost: 388 * 1.8 },
  { date: "2024-05-08", Fuel: 149, Distance: 210, TotalCost: 149 * 1.8 },
  { date: "2024-05-09", Fuel: 227, Distance: 180, TotalCost: 227 * 1.8 },
  { date: "2024-05-10", Fuel: 293, Distance: 330, TotalCost: 293 * 1.8 },
  { date: "2024-05-11", Fuel: 335, Distance: 270, TotalCost: 335 * 1.8 },
  { date: "2024-05-12", Fuel: 197, Distance: 240, TotalCost: 197 * 1.8 },
  { date: "2024-05-13", Fuel: 197, Distance: 160, TotalCost: 197 * 1.8 },
  { date: "2024-05-14", Fuel: 448, Distance: 490, TotalCost: 448 * 1.8 },
  { date: "2024-05-15", Fuel: 473, Distance: 380, TotalCost: 473 * 1.8 },
  { date: "2024-05-16", Fuel: 338, Distance: 400, TotalCost: 338 * 1.8 },
  { date: "2024-05-17", Fuel: 499, Distance: 420, TotalCost: 499 * 1.8 },
  { date: "2024-05-18", Fuel: 315, Distance: 350, TotalCost: 315 * 1.8 },
  { date: "2024-05-19", Fuel: 235, Distance: 180, TotalCost: 235 * 1.8 },
  { date: "2024-05-20", Fuel: 177, Distance: 230, TotalCost: 177 * 1.8 },
  { date: "2024-05-21", Fuel: 82, Distance: 140, TotalCost: 82 * 1.8 },
  { date: "2024-05-22", Fuel: 81, Distance: 120, TotalCost: 81 * 1.8 },
  { date: "2024-05-23", Fuel: 252, Distance: 290, TotalCost: 252 * 1.8 },
  { date: "2024-05-24", Fuel: 294, Distance: 220, TotalCost: 294 * 1.8 },
  { date: "2024-05-25", Fuel: 201, Distance: 250, TotalCost: 201 * 1.8 },
  { date: "2024-05-26", Fuel: 213, Distance: 170, TotalCost: 213 * 1.8 },
  { date: "2024-05-27", Fuel: 420, Distance: 460, TotalCost: 420 * 1.8 },
  { date: "2024-05-28", Fuel: 233, Distance: 190, TotalCost: 233 * 1.8 },
  { date: "2024-05-29", Fuel: 78, Distance: 130, TotalCost: 78 * 1.8 },
  { date: "2024-05-30", Fuel: 340, Distance: 280, TotalCost: 340 * 1.8 },
  { date: "2024-05-31", Fuel: 178, Distance: 230, TotalCost: 178 * 1.8 },
  { date: "2024-06-01", Fuel: 178, Distance: 200, TotalCost: 178 * 1.8 },
  { date: "2024-06-02", Fuel: 470, Distance: 410, TotalCost: 470 * 1.8 },
  { date: "2024-06-03", Fuel: 103, Distance: 160, TotalCost: 103 * 1.8 },
  { date: "2024-06-04", Fuel: 439, Distance: 380, TotalCost: 439 * 1.8 },
  { date: "2024-06-05", Fuel: 88, Distance: 140, TotalCost: 88 * 1.8 },
  { date: "2024-06-06", Fuel: 294, Distance: 250, TotalCost: 294 * 1.8 },
  { date: "2024-06-07", Fuel: 323, Distance: 370, TotalCost: 323 * 1.8 },
  { date: "2024-06-08", Fuel: 385, Distance: 320, TotalCost: 385 * 1.8 },
  { date: "2024-06-09", Fuel: 438, Distance: 480, TotalCost: 438 * 1.8 },
  { date: "2024-06-10", Fuel: 155, Distance: 200, TotalCost: 155 * 1.8 },
  { date: "2024-06-11", Fuel: 92, Distance: 150, TotalCost: 92 * 1.8 },
  { date: "2024-06-12", Fuel: 492, Distance: 420, TotalCost: 492 * 1.8 },
  { date: "2024-06-13", Fuel: 81, Distance: 130, TotalCost: 81 * 1.8 },
  { date: "2024-06-14", Fuel: 426, Distance: 380, TotalCost: 426 * 1.8 },
  { date: "2024-06-15", Fuel: 307, Distance: 350, TotalCost: 307 * 1.8 },
  { date: "2024-06-16", Fuel: 371, Distance: 310, TotalCost: 371 * 1.8 },
  { date: "2024-06-17", Fuel: 475, Distance: 520, TotalCost: 475 * 1.8 },
  { date: "2024-06-18", Fuel: 107, Distance: 170, TotalCost: 107 * 1.8 },
  { date: "2024-06-19", Fuel: 341, Distance: 290, TotalCost: 341 * 1.8 },
  { date: "2024-06-20", Fuel: 408, Distance: 450, TotalCost: 408 * 1.8 },
  { date: "2024-06-21", Fuel: 169, Distance: 210, TotalCost: 169 * 1.8 },
  { date: "2024-06-22", Fuel: 317, Distance: 270, TotalCost: 317 * 1.8 },
  { date: "2024-06-23", Fuel: 480, Distance: 530, TotalCost: 480 * 1.8 },
  { date: "2024-06-24", Fuel: 132, Distance: 180, TotalCost: 132 * 1.8 },
  { date: "2024-06-25", Fuel: 141, Distance: 190, TotalCost: 141 * 1.8 },
  { date: "2024-06-26", Fuel: 434, Distance: 380, TotalCost: 434 * 1.8 },
  { date: "2024-06-27", Fuel: 448, Distance: 490, TotalCost: 448 * 1.8 },
  { date: "2024-06-28", Fuel: 149, Distance: 200, TotalCost: 149 * 1.8 },
  { date: "2024-06-29", Fuel: 103, Distance: 160, TotalCost: 103 * 1.8 },
  { date: "2024-06-30", Fuel: 446, Distance: 400, TotalCost: 446 * 1.8 },
]

*/



const chartConfig = {
  views: {
    label: "Page Views",
  },
  Fuel: {
    label: "Fuel",
    color: "var(--chart-2)",
  },
  Distance: {
    label: "Distance",
    color: "var(--chart-1)",
  },
  TotalCost: {
    label: "Total Cost",
    color: "var(--chart-2)",
  }
} satisfies ChartConfig

interface BarChartProps{
    chartData:InteractiveBarChart[]
}

export function BarChartInteractive({chartData}:BarChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("Fuel")



    console.log(chartData);
    console.log("chartData in component:", chartData);
console.log("length:", chartData?.length);
    const total = React.useMemo(() => {
        if (!chartData) return { Fuel: "0l", Distance: "0km", TotalCost: "0€" };

        return {
            Fuel: chartData.reduce((acc, curr) => acc + curr.Fuel, 0).toFixed(2) + "l",
            Distance: chartData.reduce((acc, curr) => acc + curr.Distance, 0).toFixed(0) + "km",
            TotalCost:
                chartData.reduce((acc, curr) => acc + curr.TotalCost, 0).toFixed(2) + "€",
        };
    }, [chartData]);

  return (
    <Card className="py-0 w-full">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Fuel and Distance Bar Chart</CardTitle>
          <CardDescription>
            Showing total amount of Fuel, total Distance and total Cost covered
          </CardDescription>
        </div>
        <div className="flex">
          {["Fuel", "Distance", "TotalCost"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-2 text-left even:border-l sm:border-t-0 sm:border-l sm:text-sm sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-sm leading-none font-bold md:text-lg">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
