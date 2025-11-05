export interface FuelEntryType {
  fuel_filled: number;        // Liters filled
  date: Date;                 // Date of refueling
  total_price: number;        // Total price in chosen currency
  odometer:number;
  average_consumption?: number; // L/100km for this fill-up
  fullTank:boolean;
};

export interface CarType {
  id?:string,
  name: string;
  last_fill_up?: number;        // Liters of the last fill-up
  odometer: number;            // Current odometer reading
  active: boolean;             // Whether the car is active
  average_consumption?: number; // Overall average consumption (L/100km)
  compare_for_last_month_consumption?: number; // % difference vs last month
  monthly_cost?: number;        // Monthly fuel cost
  compare_for_last_month_cost?: number; // % difference vs last month cost
  fuelData?: FuelEntryType[];       // History of fuel entries
};
