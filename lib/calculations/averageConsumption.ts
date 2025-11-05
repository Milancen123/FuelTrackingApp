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

    const averageConsumptions = [];
    for(let i = 0; i < fuelData.length; i++) {
        if(fuelData[i].fullTank){
            let totalFuelFilled = 0 - fuelData[i].fuel_filled;
            const firstFuelTankEntryOdometer = Number(fuelData[i].odometer);
            let difference = 0;
            console.log("--------------------------------------------------------");
            console.log("Prvi: ", fuelData[i]);
            do{
                totalFuelFilled += Number(fuelData[i].fuel_filled);
                i++;
            }while(i < fuelData.length && !fuelData[i].fullTank );
            console.log("Poslednji: ", fuelData[i]);
            if(i <= fuelData.length - 1 && fuelData[i].fullTank) {
                totalFuelFilled += Number(fuelData[i].fuel_filled);
                console.log("Total fuel filled: ", totalFuelFilled);
                difference = fuelData[i].odometer - firstFuelTankEntryOdometer;
                console.log("Total distance travelled: ", difference);
                const avgCons = (totalFuelFilled * 100) / difference;
                console.log("Avg cons: ", avgCons);
                averageConsumptions.push(avgCons);
                i--;
            }else{
                const avgCons = 0;
            }  
        }else{
            continue;
        }
    }
    console.log(averageConsumptions);
    const totalAverage = calculateAverage(averageConsumptions);
    return totalAverage;
};

export const compareLifetimeConsumption = (fuelData: FuelEntryType[]): number => {
    if (fuelData.length < 2) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lifetimeUntilPrev: FuelEntryType[] = [];
    const lifetimeUntilCurr: FuelEntryType[] = [];

    for (let i = 1; i < fuelData.length; i++) {


        const month = new Date(fuelData[i].date).getMonth();
        const year = new Date(fuelData[i].date).getFullYear();

        // Always push into lifetime until current month
        lifetimeUntilCurr.push(fuelData[i]);

        // Only push if before this month
        const isBeforeCurrentMonth =
            year < currentYear ||
            (year === currentYear && month < currentMonth);

        if (isBeforeCurrentMonth) {
            lifetimeUntilPrev.push(fuelData[i]);
        }
    }

    if (lifetimeUntilPrev.length === 0 || lifetimeUntilCurr.length === 0) {
        return 0;
    }


    const avgPrev = totalAverageConsumption(lifetimeUntilPrev);

    const avgCurr = totalAverageConsumption(lifetimeUntilCurr);

    if(!avgCurr || !avgPrev) return 0;


    return ((avgPrev - avgCurr) / avgPrev) * 100;
};
