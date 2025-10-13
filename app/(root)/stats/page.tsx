import User from '@/database/user.model';
import dbConnect from '@/lib/mongoose';
import React from 'react'

const Page = () => {
    (async () => {
        await dbConnect();
        const mockUser = {
            name: "John Doe",
            username: "johndoe123",
            email: "john@example.com",
            image: "https://i.pravatar.cc/150?u=john@example.com",
        };

        const user = await User.create(mockUser);
        console.log("✅ User created:", user);
    })();

    return (
        <div>Page</div>
    )
}

export default Page