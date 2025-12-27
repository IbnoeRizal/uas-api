import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(params) {
    try{
        const users = await prisma.user.findMany();
        return NextResponse.json(
            {
                message:users.length ?users:"no user found"
            },
            {
                status: users.length ? 200: 401
            }
        );
    }catch(e){
        console.error(e);
        return NextResponse.json({message:"internal server error"},{status:500})
    }
}