import { NextResponse } from "next/server";
import { flaterr, Enrollment, Enrollment_delete } from "@/lib/authschema";
import { prismaError } from "@/lib/prismaErrorResponse";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { pagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {NextResponse}
 */
export async function GET(request){
    const payload = await getUserFromRequest(request);
    try{
        requireRole(payload,[Role.Student]);
        const id = payload.id;

        const enrollments = await prisma.enrollment.findMany({
            where:{
                userId:id,
            },
            select:{
                course:{
                    select:{
                        name:true,
                    }
                },
                user:{
                    select:{
                        name:true,
                    }
                },
                grade:true,
            }

        });
        return NextResponse.json({enrollments},{status:st2xx.ok});

    }catch(e){
        if(e.message && e.message == "FORBIDDEN")
            return new NextResponse(`${e.message}`,{status:st4xx.forbidden});

        console.error(`${e.name} ${e.message} \n${e.stack}`);
        return prismaError(e)?? new NextResponse("Internal server error",{status:st5xx.internalServerError});
    }
}