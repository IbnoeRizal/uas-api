import {prisma} from "@/lib/prisma";
import { NextResponse} from "next/server";
import { Role } from "@prisma/client";
import { getUserFromRequest,requireRole } from "@/lib/auth";
import { st5xx,st4xx } from "@/lib/responseCode";
import { User_delete } from "@/lib/authschema";

/**
 * @param {import("next/server").NextRequest} request 
 */
export async function GET(request) {
    const payload = await getUserFromRequest(request);

    try{

        requireRole(payload,[Role.Admin]);

        const users = await prisma.user.findMany();
        return NextResponse.json(
            {message:users.length ?users:"no user found"},
            {status: users.length ? 200: 401}
        );

    }catch(e){

        if(e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbiddden});

        console.error(`${e.name}: ${e.message} \n ${e.stack}`);
        return new NextResponse("internal server error",{status:st5xx.internalServerError});
    }
}

/**
 * @param {import ("next/server").NextRequest} request 
 */
export async function DELETE(request) {
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload,[Role.Admin]);
        const rawdata = await request.json();
        const validate = User_delete.safeParse(rawdata);
        
        if(!validate.success)
            return NextResponse.json({message:validate.error},{status:st4xx.badRequest});
        const user = await prisma.user.delete({
            where:validate.data,
        });
        return NextResponse.json(
            {message:user ?`${user.name} deleted`:"no user found"},
            {status: user.length ? 200: 401}
        );

    }catch(e){

        if(e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbiddden});

        console.error(`${e.name}: ${e.message} \n ${e.stack}`);
        return new NextResponse("internal server error",{status:st5xx.internalServerError});
    }

}