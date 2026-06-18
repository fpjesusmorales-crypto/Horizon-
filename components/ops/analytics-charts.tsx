"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface RevenuePoint {
  month: string
  revenue: number
}

interface JobsPoint {
  month: string
  completed: number
}

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const jobsConfig = {
  completed: {
    label: "Completed Jobs",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ChartContainer config={revenueConfig} className="h-[280px] w-full">
      <LineChart data={data} margin={{ left: 12, right: 12, top: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `$${v}`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={{ fill: "var(--color-revenue)" }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export function JobsChart({ data }: { data: JobsPoint[] }) {
  return (
    <ChartContainer config={jobsConfig} className="h-[280px] w-full">
      <BarChart data={data} margin={{ left: 12, right: 12, top: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
