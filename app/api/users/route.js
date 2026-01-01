import {prisma} from "@/lib/prisma";
import { NextResponse} from "next/server";
import { Role } from "@prisma/client";
import { getUserFromRequest,requireRole } from "@/lib/auth";
import { st5xx,st4xx, st2xx } from "@/lib/responseCode";
import { User_delete } from "@/lib/authschema";
import { pagination } from "@/lib/pagination";
import { prismaError } from "@/lib/prismaErrorResponse";
/**
 * @param {import("next/server").NextRequest} request 
 */
export async function GET(request) {
    const payload = await getUserFromRequest(request);

    try{

        requireRole(payload,[Role.Admin]);
        const {page,limit} = pagination(request);
        const [users,total] = await Promise.all([
            prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy:{id:"asc"}
            }),
            prisma.user.count()
        ]) 
        return NextResponse.json(
            {message:users.length ?users:"no user found",total},
            {status: users.length ? st2xx.ok: st4xx.notFound}
        );

    }catch(e){

        if( e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name}: ${e.message} \n ${e.stack}`);

        return prismaError(e)?? new NextResponse("internal server error",{status:st5xx.internalServerError});
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
            {message:`${user.name} deleted`},
            {status: st2xx.ok}
        );

    }catch(e){

        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name}: ${e.message} \n ${e.stack}`);
        return prismaError(e)?? new NextResponse("internal server error",{status:st5xx.internalServerError});
    }

}