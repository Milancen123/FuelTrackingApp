"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { IFuelLogUpdate } from '@/app/(root)/fuel/[id]/page'


export const getFuelLogFormSchema = (previousOdometer: number, previousDate:Date) =>
    z.object({
    odometer: z.coerce
      .number()
      .refine((val) => val > previousOdometer, {
        message: `Odometer must be greater than previous reading (${previousOdometer})`,
      }),
    fuelAmount: z.coerce.number(),
    price: z.coerce.number(),
    date: z
      .string()
      .min(1, "Date is required")
      .refine(
        (val) => {
          const currentDate = new Date(val);
          return currentDate > previousDate;
        },
        {
          message: `Date must be after the previous fill-up date (${previousDate.toLocaleDateString()})`,
        }
      )
  });

type FuelLogFormValues = z.infer<ReturnType<typeof getFuelLogFormSchema>>;


const FuelLogEdit = ({ id, odometer, fuelAmount, price, fullTank, date, previousOdometer, previousDate }: IFuelLogUpdate) => {
  const formSchema = getFuelLogFormSchema(previousOdometer, previousDate);
  const form = useForm<FuelLogFormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues:{
      odometer:odometer,
      fuelAmount:fuelAmount,
      price:price,
      date:new Date(date).toISOString().split("T")[0],
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }




  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="odometer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odometer</FormLabel>
              <FormControl>
                <Input placeholder={`${odometer}`} {...field}  />
              </FormControl>
              <FormDescription>
                Last Odometer reading: {previousOdometer}km
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fuelAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Amount</FormLabel>
              <FormControl>
                <Input placeholder={`${fuelAmount}`} {...field} />
              </FormControl>
              <FormDescription>
                Please insert the amount of fuel in liters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total price</FormLabel>
              <FormControl>
                <Input placeholder={`${price}`} {...field}  />
              </FormControl>
              <FormDescription>
                Please insert the total amount you paid
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input placeholder={`${date}`} {...field} type="date" />
              </FormControl>
              <FormDescription>
                Please insert the date of the fill up that is after: {previousDate.toISOString().split("T")[0]}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='cursor-pointer'>Update Record</Button>
      </form>
    </Form>
  )
}

export default FuelLogEdit