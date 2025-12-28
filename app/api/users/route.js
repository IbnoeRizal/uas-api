import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { User_register, flaterr} from "@/lib/authschema";

/**
 * @param {NextRequest} request 
 */
export async function GET(request) {
    try{
        const users = await prisma.user.findMany();
        return NextResponse.json(
            {message:users.length ?users:"no user found"},
            {status: users.length ? 200: 401}
        );
    }catch(e){
        console.error(e);
        return NextResponse.json({message:"internal server error"},{status:500})
    }
}

/**
 * @param {NextRequest} request 
 */
export async function POST(request) {
    try{
        const data = await request.json();
        const datavalidated = User_register.safeParse(data);

        if(!datavalidated.success)
            return NextResponse.json(
                { message: flaterr(datavalidated.error)},
                { status: 400}
            );
        
        const freshUser = await prisma.user.create(datavalidated.data);

        return NextResponse.json(freshUser);
    }catch(e){
        console.error(`error POST function ${e}`);
        return NextResponse.json({message:"internal server error"}, {status:500})
    }
}