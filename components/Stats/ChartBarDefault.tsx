"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

interface ChartBarProps {
  data: unknown[]
  xKey: string
  yKey: string
  title?: string
  description?: string
  colorVar?: string // default CSS variable for chart color
}

export function ChartBarDefault({
  data,
  xKey,
  yKey,
  title = "Bar Chart",
  description = "",
  colorVar = "--chart-1",
}: ChartBarProps) {
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
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              dataKey={yKey}
              fill={`var(${colorVar})`}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

    </Card>
  )
}
