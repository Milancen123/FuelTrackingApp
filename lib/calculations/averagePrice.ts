import { FuelEntryType } from "@/types/car";

export const totalSpentThisMonth = (fuelData: FuelEntryType[]): number => {
    if (!fuelData.length) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyEntries = fuelData.filter(entry => {
        const month =new Date(entry.date).getMonth();
        const year = new Date(entry.date).getFullYear();

        return month === currentMonth && year === currentYear;
    });

    return monthlyEntries.reduce((sum, entry) => sum + entry.total_price, 0);
};


export const totalSpentLastMonth = (fuelData: FuelEntryType[]): number => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    return fuelData
        .filter(entry => 
            new Date(entry.date).getMonth() === previousMonth &&
            new Date(entry.date).getFullYear() === previousYear
        )
        .reduce((sum, entry) => sum + entry.total_price, 0);
};

export const compareMonthlyFuelCost = (fuelData: FuelEntryType[]): number => {
    const current = totalSpentThisMonth(fuelData);
    const previous = totalSpentLastMonth(fuelData);

    

    return current - previous;
};

