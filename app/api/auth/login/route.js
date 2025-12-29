import { User_login,flaterr } from "@/lib/authschema";
import { NextResponse } from "next/server";
import {st4xx, st2xx, st5xx} from "@/lib/responseCode"
import { prisma } from "@/lib/prisma";
import { getToken } from "@/lib/auth";


/**
 * 
 * @param {import ("next/server").NextRequest} request 
 */
export async function POST(request) {
    const rawdata = await request.json();
    const validate = User_login.safeParse(rawdata);

    if(!validate.success){
        return NextResponse.json(
            {message: flaterr(validate.error)},
            {status: st4xx.badRequest}
        );
    }

    try{
        const user = prisma.user.findFirstOrThrow(
            {
                where:validate.data,
                select:{
                    id:true,
                    role:true
                }
            }
        );
        const token = getToken(user);
        return NextResponse.json({message:"token",token },{status: st2xx.ok});
        
    }catch(e){

        if(e.code && e.code == "P2025")
            return NextResponse.json({message: "user not found"},{status: st4xx.notFound});

        console.error(`User Login Error: ${e}`);
        return NextResponse.json({message:"internal server error"},{status: st5xx.internalServerError});
    }
}