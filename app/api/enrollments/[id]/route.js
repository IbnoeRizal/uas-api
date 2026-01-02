import { NextResponse } from "next/server";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { st2xx , st4xx, st5xx} from "@/lib/responseCode";
import { prismaError } from "@/lib/prismaErrorResponse";
import { Enrollment_update, flaterr } from "@/lib/authschema";

/**
 * @param {import ("next/server").NextRequest} request 
 * @param {{params:{id:string}}} context
 * @return {NextResponse}
 */
export async function GET(request,context){
    const payload = await getUserFromRequest(request);
    const id = Number((await context.params).id);
    
    try{
        requireRole(payload,[Role.Admin]);
        const enrollment = prisma.enrollment.findUniqueOrThrow({
            where:{id:id},
            select:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    }
                },
                course:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
            }
        });

        return NextResponse.json({enrollment},{status:st2xx.ok});
    }catch(e){
        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} ${e.message} \n${e.stack}`);
        return prismaError(e)?? new NextResponse("Internal server error",{status:st5xx.internalServerError});
    }
}

/**
 * @param {import ("next/server").NextRequest} request 
 * @param {{params:{id:string}}} context 
 * @returns {NextResponse}
 */
export async function PATCH(request,context){
    const payload = await getUserFromRequest(request);
    const id = Number((await context.params).id);

    try{
        requireRole(payload,[Role.Admin]);
        const rawdata = await request.json();
        const validate = Enrollment_update.safeParse(rawdata);

        if(!validate.success)
            return NextResponse.json({message:flaterr(validate.error)},{status:st4xx.badRequest});

        const isAdmin = !validate.data.userId &&
                        prisma.user.findUniqueOrThrow({
                            where:{id:validate.data.userId},
                            select:{role:true}
                        }).then(x => x.role === Role.Admin); 

        if(isAdmin)
            throw new Error("FORBIDDEN",{cause:"Admin can't participate"});

        const enrollment = await prisma.enrollment.update({
            where:{id:id},
            data:validate.data
        });

        return NextResponse.json({message:`enrollment updated successfully`,enrollment},{status:st2xx.ok});

    }catch(e){
        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} ${e.message} \n${e.stack}`);
        return prismaError(e)?? new NextResponse("Internal server error",{status:st5xx.internalServerError});
    }
}