import { NextResponse } from "next/server";
import { flaterr, Enrollment, Enrollment_delete } from "@/lib/authschema";
import { prismaError } from "@/lib/prismaErrorResponse";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { pagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";

/**
 * @param {import ("next/server").NextRequest} request
 * @returns {NextResponse} 
 */
export async function GET(request){
    const payload = await getUserFromRequest(request);
    try{
        requireRole(payload, [Role.Admin]);
        const {page,limit} = pagination(request);

        const [enrollments, total]= await Promise.all([
            prisma.enrollment.findMany({
                skip: (page - 1) * limit,
                take: limit,
                select:{
                    id:true,
                    course:{
                        select:{
                            id:true,
                            name:true,
                        }
                    },
                    user:{
                        select:{
                            id:true,
                            name:true,
                            email:true,
                        }
                    }
                }
            }),
            prisma.enrollment.count()
        ]);
        
        return NextResponse.json({enrollments, total},{status:st2xx.ok});
        
    }catch(e){
        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} ${e.message} \n${e.stack}`);
        return prismaError(e)?? new NextResponse("Internal server error",{status:st5xx.internalServerError});
    }
}

/**
 * @param {import ("next/server").NextRequest} request 
 * @returns {NextResponse} 
 */
export async function POST(request){
    const payload = await getUserFromRequest(request);
    try{
        requireRole(payload,[Role.Admin]);
        const rawdata = await request.json();
        const validate = Enrollment.safeParse(rawdata);

        if(!validate.success)
            return NextResponse.json({message:flaterr(validate.error)},{status:st4xx.badRequest});

        const isAdmin = await prisma.user.findUniqueOrThrow({
            where:{id:validate.data.userId},
            select:{role:true}
        }).then(x => x.role === Role.Admin);

        if(isAdmin)
            throw new Error("FORBIDDEN",{cause:"Admin can't participate"});
        
        const enrollment = await prisma.enrollment.create({
            data:validate.data,
            select:{
                userId:true,
                courseId:true,               
            }

        });

        return NextResponse.json({message:`enrollment created`,enrollment},{status:st2xx.created});

    }catch(e){
        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} ${e.message} \n${e.stack}`);
        return prismaError(e)?? new NextResponse("Internal server error",{status:st5xx.internalServerError});
    }
}

/**
 * @param {import ("next/server").NextRequest} request 
 * @returns {NextResponse} 
 */
export async function DELETE(request){
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload,[Role.Admin]);
        const rawdata = await request.json();
        const validate = Enrollment_delete.safeParse(rawdata);

        if(!validate.success)
            return NextResponse.json({message:flaterr(validate.error)},{status:st4xx.badRequest});

        const enrollment = await prisma.enrollment.delete({
            where:validate.data.id ? {id:validate.data.id} : {
                userId_courseId:{
                    userId:validate.data.userId,
                    courseId:validate.data.courseId
                }
            },
            select:{
                courseId:true,
                userId:true
            }
        });

        return NextResponse.json({message:`enrollment id:${enrollment.id} deleted successfully`,enrollment},{status:st2xx.ok});

    }catch(e){
        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} ${e.message} \n${e.stack}`);
        return prismaError(e)?? new NextResponse("Internal server error",{status:st5xx.internalServerError});
    }
}