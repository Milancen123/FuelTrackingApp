"use client"

import React, { useState } from 'react'
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
import { toast } from 'sonner'
import { redirect } from 'next/navigation'


export const getFuelLogFormSchema = (previousOdometer: number, previousDate:Date) =>
    z.object({
    odometer: z.coerce
      .number()
      .refine((val) => val > previousOdometer, {
        message: `Odometer must be greater than previous reading (${previousOdometer})`,
      }),
    fuelAmount: z.coerce.number(),
    fullTank:z.boolean(),
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


const FuelLogEdit = ({ id, vehicleId, odometer, fuelAmount, price, fullTank, date, previousOdometer, previousDate }: IFuelLogUpdate) => {
  const [updating, setUpdating] = useState(false);
  const formSchema = getFuelLogFormSchema(previousOdometer, previousDate);
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const form = useForm<FuelLogFormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues:{
      odometer:odometer,
      fuelAmount:fuelAmount,
      fullTank:fullTank,
      price:price,
      date:localDate,
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      setUpdating(true);
      const response = await fetch(`/api/updateFuelLog/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId,
          odometer: values.odometer,
          fuelAmount: values.fuelAmount,
          fullTank:values.fullTank,
          totalPrice: values.price,
          date: values.date,
        }),
      });

    }catch(err){
      console.error(err);
      setUpdating(false);
      toast.error("Couldn't update your record, please try again");
    }finally{
      toast.success("Your record has been updated successfully");
      redirect("/log");
      setUpdating(false);
    }

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
          name="fullTank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Tank</FormLabel>
              <FormControl>
                <Input type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-5 h-5" />
              </FormControl>
              <FormDescription>
                Please check if you topped the tank: {field.value?<span className='text-green-400 font-semibold '>You topped the tank</span>:<span className='text-red-400 font-semibold'>It was a partial fill up</span>}
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
        <Button type="submit" className='cursor-pointer' disabled={updating}>{updating?"Updating...":"Update Record"}</Button>
      </form>
    </Form>
  )
}

export default FuelLogEdit