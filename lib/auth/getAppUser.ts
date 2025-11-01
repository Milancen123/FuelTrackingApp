import { auth } from '@clerk/nextjs/server';
import React from 'react'
import { handleError } from '../handlers/error';

const getAppUser = async () => {

    try {
        const { userId } = await auth(); // <-- this is how you get the current user's clerk username which we will use to extract mongodb id
        if (!userId) return;
        const res = await fetch(`${process.env.BASEURI}/api/users?clerkId=${userId}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Fetch failed:", res.status);
            throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        const mongoID = data.data._id;
        return {
            clerkId: userId,
            mongoId:mongoID
        }
    } catch (err) {
        console.error(err);
        handleError(err);
    }



}

export default getAppUser;