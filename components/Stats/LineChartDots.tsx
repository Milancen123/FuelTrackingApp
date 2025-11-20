"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

interface LineChartDotsProps {
  data: unknown[]
  xKey: string
  yKey: string
  title?: string
  description?: string
  colorVar?: string // e.g. --chart-1
}

export function LineChartDots({
  data,
  xKey,
  yKey,
  title = "Line Chart",
  description = "",
  colorVar = "--chart-1",
}: LineChartDotsProps) {
  const chartConfig = {
    desktop: {
      label: "Data",
      color: `var(${colorVar})`,
    },
  } satisfies ChartConfig

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
