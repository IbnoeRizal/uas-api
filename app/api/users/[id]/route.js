import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";
import { User_update, flaterr } from "@/lib/authschema";
import { hasherpass } from "@/lib/hashpass";
import { getUserFromRequest,requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { prismaError } from "@/lib/prismaErrorResponse";

/**
 * @param {import ("next/server").NextRequest} request 
 * @param {{ params: { id: string } }} context
 */
export async function GET(request,context) {
    const payload = await getUserFromRequest(request);
    try{
        requireRole(payload,[Role.Admin]);
        const id = Number(( await context.params).id)
        const users = await prisma.user.findUniqueOrThrow({
            where:{
                id: id,    
            },
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
                
                enrollments:{
                    select:{
                        enrolledAt: true,
                        grade: true,

                        course:{
                            select:{
                                name:true
                            }
                        }
                    }
                }              
            }
        });
        return NextResponse.json(
            {message: users},
            {status: st2xx.ok}
        );
    }catch(e){
        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} : ${e.message} \n${e.stack}`);
        return prismaError(e)?? NextResponse.json({message:"internal server error"},{status:st5xx.internalServerError})
    }
}

/**
 * @param {import ("next/server").NextRequest} request 
 * @param {{ params: { id: string } }} context
 */
export async function PATCH(request, context) {
    const payload = await getUserFromRequest(request);
    try{
        requireRole(payload,[Role.Admin]);
        const id = Number((await context.params).id);
    
        const validate = User_update.safeParse(await request.json());

        if(!validate.success){
            return NextResponse.json({message: flaterr(validate.error)},{status:st4xx.badRequest});
        }
        
        const cp = {...validate.data};
        
        if(cp.password){
            cp.password = await hasherpass(cp.password);
        }

        const update = await prisma.user.update({
            where:{id:id},
            data:cp,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        
        return NextResponse.json({message: `User updated successfully `, updated: update}, {status:st2xx.ok});

    }catch(e){

        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} : ${e.message} \n${e.stack}`);
        return prismaError(e)?? NextResponse.json({message:"internal server error"},{status:st5xx.internalServerError});
    }
    
}