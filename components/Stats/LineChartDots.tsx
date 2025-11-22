"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import FuelConsumptionGuide from "./FuelConsumptionGuide"

interface LineChartDotsProps {
  data: unknown[]
  xKey: string
  yKey: string
  title?: string
  description?: string
  colorVar?: string // e.g. --chart-1
  peakDetection?:boolean
}

export function LineChartDots({
  data,
  xKey,
  yKey,
  title = "Line Chart",
  description = "",
  colorVar = "--chart-1",
  peakDetection,
}: LineChartDotsProps) {
  const chartConfig = {
    desktop: {
      label: "Data",
      color: `var(${colorVar})`,
    },
  } satisfies ChartConfig

  const [values, setValues] = useState([]);
  const [globalAvg, setGlobalAvg] = useState(0);
  const [sd, setSd] = useState(0);
  useEffect(() => {
    if (!peakDetection) return;
    //@ts-expect-error unknown expected
    const vals:[] = data.map((d: unknown) => d.avgCons);

    if (vals.length === 0) return;

    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / vals.length;
    const standardDeviation = Math.sqrt(variance);

    setValues(vals);
    setGlobalAvg(mean);
    setSd(standardDeviation);

    console.log(vals, mean, standardDeviation);
  }, [data, peakDetection]);


  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {peakDetection && <FuelConsumptionGuide/>}
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {peakDetection && (
                <ReferenceLine
                  y={globalAvg}                  // value where the line is drawn
                  label={""}              // optional text
                  stroke="gray"                        // line color
                  strokeDasharray="4 4"               // dashed line
                  strokeWidth={2}
                />
            )}
            {peakDetection && (
                <ReferenceLine
                  y={globalAvg + sd}                  // value where the line is drawn
                  label={""}              // optional text
                  stroke="red"                        // line color
                  strokeDasharray="4 4"               // dashed line
                  strokeWidth={2}
                />
            )}
            {peakDetection && (
                <ReferenceLine
                  y={globalAvg - sd}                  // value where the line is drawn
                  label={""}              // optional text
                  stroke="green"                        // line color
                  strokeDasharray="4 4"               // dashed line
                  strokeWidth={2}
                />
            )}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Line
              dataKey={yKey}
              type="natural"
              stroke={`var(${colorVar})`}
              strokeWidth={2}
              dot={{
                fill: `var(${colorVar})`,
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      
    </Card>
  )
}
