import { NextResponse } from "next/server";
import { createUser } from "@/queries/users";
import { dbConnect } from "@/lib/mongo";
import bcrypt from "bcryptjs";

export const POST =  async (request) => {
    const {name, email, password} = await request.json();

    // Create a DB Connection
    await dbConnect();

    // Encrypt the password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Form a DB payload
    const newUser = {
        name,
        password: hashedPassword,
        email
    }

    // Update the DB
    try{
        await createUser(newUser);
    }catch(err){
        console.log(err.message);
        return new NextResponse(err.message, {
            status: 500,
        });
    }

    return new NextResponse('User has been created', {
        status: 201,
    });

}