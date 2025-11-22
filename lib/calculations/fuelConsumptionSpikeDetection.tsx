import { FuelEntryType } from "@/types/car";
import { averageConsumptionBetweenTwoFillUps } from "./averageConsumption";
import { FuelLogCardProps } from "@/components/FuelLogCard";
import { FuelConsumptionPeaksI } from "@/components/Stats/StatsPage";



export const fuelConsumptionSpikeDetection = (fuelData: FuelLogCardProps[]):FuelConsumptionPeaksI[] => {

    if (fuelData.length <= 1) return [];


    const averageConsumptions = [];
    let endOfTheCycle;
    for(let i = 0; i < fuelData.length; i++) {
        if(fuelData[i].fullTank){
            let totalFuelFilled = 0 - fuelData[i].volume;
            const firstFuelTankEntryOdometer = Number(fuelData[i].odometer);
            let difference = 0;
            do{
                totalFuelFilled += Number(fuelData[i].volume);
                i++;
            }while(i < fuelData.length && !fuelData[i].fullTank );
            
            //sacuvaj end date za taj ciklus
            if(i <= fuelData.length - 1 && fuelData[i].fullTank) {
                totalFuelFilled += Number(fuelData[i].volume);
                
                difference = fuelData[i].odometer - firstFuelTankEntryOdometer;
               
                const avgCons = (totalFuelFilled * 100) / difference;

                endOfTheCycle = `${fuelData[i].date.getFullYear()}-${String(fuelData[i].date.getMonth() + 1).padStart(2, "0")}-${String(fuelData[i].date.getDate()).padStart(2, "0")}`;
                averageConsumptions.push({date:endOfTheCycle, avgCons});
                i--;
            }else{
                const avgCons = 0;
            }  
        }else{
            continue;
        }
    }


    //const totalAverage = calculateAverage(average_consumptions);
    console.log("________________________________________________________________")
    console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/");
    console.log(averageConsumptions);
    console.log("---------------------------------------------------------------")


    return averageConsumptions;

};