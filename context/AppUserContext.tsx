"use client"
import { handleError } from '@/lib/handlers/error';
import { useAuth } from '@clerk/nextjs';
import React, { createContext, useContext, useEffect, useState } from 'react'

type AppUserContextType = {
  clerkId:string | null,
  mongoId:string | null,
  loading:boolean,
};

const AppUserContext = createContext<AppUserContextType>({
  clerkId:null,
  mongoId:null,
  loading:true,
})


export const AppUserProvider = ({ children }: { children: React.ReactNode }) => {
  const {userId} = useAuth();
  const [mongoId, setMongoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    const fetchMongoId = async()=>{
      try{
        const res = await fetch(`/api/users?clerkId=${userId}`);
        if (!userId) return;
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Fetch failed:", res.status);
            throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        const mongoID = data.data._id;
        setMongoId(mongoID);
      }catch(err){
        handleError(err, 'api');
      } finally{
        setLoading(false);
      }
    };

    fetchMongoId();

  }, [userId]);

  if(!userId) return;


  return (
    <AppUserContext value={{clerkId: userId, mongoId, loading}}>
      {children}
    </AppUserContext>
  )
}

export const useAppUser = ()=>useContext(AppUserContext);