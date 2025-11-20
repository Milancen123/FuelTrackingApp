import { FuelLogCardProps } from "@/components/FuelLogCard";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateFuelAnalyticsData(logs: FuelLogCardProps[]) {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const formatDate = (d: Date) =>
    d.toLocaleString("en-US", { month: "short", day: "2-digit" });

  // --- Fuel Price Trend ---
  const fuelPriceTrend = logs.map((log, index) => ({
    date: `${formatDate(log.date)}${index > 0 && formatDate(log.date) === formatDate(logs[index - 1].date) ? ` (${index})` : ""}`,
    price: Number(log.totalPrice / log.volume),
  }));

  // --- Odometer Progression ---
  const odometerProgression = logs.map((log, index) => ({
    date: `${formatDate(log.date)}${index > 0 && formatDate(log.date) === formatDate(logs[index - 1].date) ? ` (${index})` : ""}`,
    km: log.odometer,
  }));

  // --- Monthly Spending ---
  const monthlyTotals: Record<string, number> = {};

  logs.forEach((log) => {
    const monthName = months[log.date.getMonth()];
    monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + log.totalPrice;
  });

  const monthlySpending = Object.entries(monthlyTotals).map(
    ([month, cost]) => ({
      month,
      cost: Number(cost.toFixed(2)),
    })
  );

  return {
    fuelPriceTrend,
    odometerProgression,
    monthlySpending,
  };
}