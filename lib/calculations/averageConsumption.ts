import { FuelEntryType } from "@/types/car";
import { cp } from "fs";

interface IAverageConsumption {
    average_consumption: number,
    compare_at_average_consumption: number,
}

const calculateAverage = (data: number[]): number => {
    let sum = 0;
    for (const num of data) {
        sum += num;
    }

    const avg = sum / data.length;

    return avg;
}



export const averageConsumptionBetweenTwoFillUps = (fuel_filled: number, current_odometer: number, previous_odometer: number): number => {
    const odometer_difference = current_odometer - previous_odometer;
    const average_consumption = (fuel_filled * 100) / odometer_difference;
    return Math.round(average_consumption * 100) / 100;
}

export const totalAverageConsumption = (fuelData: FuelEntryType[]): number => {

    if (fuelData.length <= 1) return 0;

    const average_consumptions: number[] = [];
    for (let i = 1; i < fuelData.length; i += 1) {
        const previous_odometer = Number(fuelData[i - 1].odometer);
        const current_odometer = Number(fuelData[i].odometer);
        const fuel_filled = Number(fuelData[i].fuel_filled);
        const averageConsumption = averageConsumptionBetweenTwoFillUps(fuel_filled, current_odometer, previous_odometer);
        average_consumptions.push(averageConsumption);
    }


    const totalAverage = calculateAverage(average_consumptions);

    return totalAverage;

};

export const compareLifetimeConsumption = (fuelData: FuelEntryType[]): number => {
    if (fuelData.length < 2) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lifetimeUntilPrev: number[] = [];
    const lifetimeUntilCurr: number[] = [];

    for (let i = 1; i < fuelData.length; i++) {
        const prev = fuelData[i - 1];
        const curr = fuelData[i];

        const avg = averageConsumptionBetweenTwoFillUps(
            curr.fuel_filled,
            curr.odometer,
            prev.odometer
        );

        const month = new Date(curr.date).getMonth();
        const year = new Date(curr.date).getFullYear();

        // Always push into lifetime until current month
        lifetimeUntilCurr.push(avg);

        // Only push if before this month
        const isBeforeCurrentMonth =
            year < currentYear ||
            (year === currentYear && month < currentMonth);

        if (isBeforeCurrentMonth) {
            lifetimeUntilPrev.push(avg);
        }
    }

    if (lifetimeUntilPrev.length === 0 || lifetimeUntilCurr.length === 0) {
        return 0;
    }

    const avgPrev =
        lifetimeUntilPrev.reduce((a, b) => a + b, 0) / lifetimeUntilPrev.length;

    const avgCurr =
        lifetimeUntilCurr.reduce((a, b) => a + b, 0) / lifetimeUntilCurr.length;

    return ((avgPrev - avgCurr) / avgPrev) * 100;
};
