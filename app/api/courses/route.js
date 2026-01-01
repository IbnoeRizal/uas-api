import { Course, Course_delete, flaterr } from "@/lib/authschema";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest,requireRole } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { pagination } from "@/lib/pagination";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { prismaError } from "@/lib/prismaErrorResponse";

/**
 * 
 * @param {import ("next/server").NextRequest} request 
 */
export async function GET(request) {
    const payload = await getUserFromRequest(request);
    try{
        requireRole(payload,[Role.Admin,Role.Student]);
        const{page,limit}=pagination(request);

        const isAdmin = payload.role === Role.Admin;

        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                select:{
                    id: true,
                    name: true,
                    createdAt: true,
                },
                orderBy:{
                    name:"asc"
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.course.count()
        ]);

        const safeCourses = courses.map(c => ({
            id: isAdmin ? c.id : null,
            name: c.name,
            createdAt: isAdmin ? c.createdAt : null,
        }));

        return NextResponse.json({safeCourses,total},{status:st2xx.ok})

    }catch(e){
        if (e.message === "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});
        
        console.error(`${e.name} : ${e.message} ${e.stack}`);
        return prismaError(e)?? new NextResponse("internal server error",{status:st5xx.internalServerError});
    }    
}

/**
 * @param {import ("next/server").NextRequest} request 
 */
export async function POST(request) {
   const payload = await getUserFromRequest(request);
   
   try{
        requireRole(payload,[Role.Admin]);
        const rawdata = await request.json();
        const validate = Course.safeParse(rawdata);

        if(!validate.success)
            return NextResponse.json({message: flaterr(validate.error)},{status:st4xx.badRequest});

        const course = await prisma.course.create({data:validate.data,select:{id:true,name:true}});

        return NextResponse.json({message:"success", course},{status:st2xx.created});

   }catch(e){

        if (e.message === "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});
        
        console.error(`${e.name} : ${e.message} ${e.stack}`);
        return prismaError(e)?? new NextResponse("internal server error",{status:st5xx.internalServerError});
   }
}

/**
 * @param {import ("next/server").NextRequest} request 
 */
export async function DELETE(request){
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload,[Role.Admin]);
        const rawdata = await request.json();
        const validate = Course_delete.safeParse(rawdata);

        if(!validate.success)
            return NextResponse.json({message: flaterr(validate.error)},{status:st4xx.badRequest});

        const course = await prisma.course.delete({
            where:validate.data,
            select:{
                id:true,
                name:true,
            }
        });
        
        return NextResponse.json({message: "course deleted successfully", course},{status:st2xx.ok});
    }catch{
        if (e.message === "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});
        
        console.error(`${e.name} : ${e.message} ${e.stack}`);
        return prismaError(e)?? new NextResponse("internal server error",{status:st5xx.internalServerError});
    }
}