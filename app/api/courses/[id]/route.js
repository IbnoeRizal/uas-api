import { NextResponse } from "next/server";
import { Course,flaterr } from "@/lib/authschema";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";

/** 
 * @param {import("next/server").NextRequest} request 
 * @param {{params:{id:number}}} context
 */
export async function GET(request,context) {
    const payload = await getUserFromRequest(request);
    const id = Number((await context.params).id);

    try{
        requireRole(payload, [Role.Admin]);

        const course = await prisma.course.findUniqueOrThrow({
            where:{
                id:id
            },
            include:{
                enrollments:{
                    select:{
                        grade:true,
                        user:{
                            select:{
                                id:true,
                                name:true,
                                email:true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({course},{status:st2xx.ok});

    }catch(e){
        
        if(e.code === 'P2025')
            return new NextResponse("no matches were found",{status:st4xx.notFound});
        
        if(e.message === 'FORBIDDEN')
            return new NextResponse(`${e.message}`,{status:st4xx.forbiddden});

        console.error(`${e.name} : ${e.message} \n ${e.stack}`);
        return new NextResponse("internal server error",{status:st5xx.internalServerError});
    }
    
}

/** 
 * @param {import("next/server").NextRequest} request 
 * @param {{params:{id:number}}} context
 */
export async function PATCH(request,context) {
    const payload = await getUserFromRequest(request);
    const id = Number((await context.params).id);

    try{
        requireRole(payload,[Role.Admin]);
        const rawdata = await request.json();
        const validate = Course.safeParse(rawdata);

        if(!validate.success)
            return NextResponse.json({message: flaterr(validate.error)},{status:st4xx.badRequest});

        const course = await prisma.course.update({
            where:{
                id:id
            },
            data:validate.data,
            select:{
                name:true,
            }
        })

        return NextResponse.json({message:`${course.name} updated successfully`},{status:st2xx.ok});

    }catch(e){
        if(e.message === 'FORBIDDEN')
            return new NextResponse(`${e.message}`,{status:st4xx.forbiddden});

        console.error(`${e.name} : ${e.message} \n ${e.stack}`);
        return new NextResponse("internal server error",{status:st5xx.internalServerError});    
    }
    
}