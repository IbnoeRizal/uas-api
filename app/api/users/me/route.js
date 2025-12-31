import { NextResponse } from "next/server";
import { st5xx, st4xx,st2xx } from "@/lib/responseCode";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


/**@param {import ("next/server").NextRequest} request */
export async function GET(request) {
    const payload = await getUserFromRequest(request);
    
    if (!payload)
        return new NextResponse("UNAUTHORIZED",{status:st4xx.unauthorized});

    try{
        const user = await prisma.user.findUniqueOrThrow({
            where:{id: payload.id,},
            select:{
                name:true,
                email:true,
                role:true,
                enrollments:{

                    select:{

                        grade:true,

                        course:{
                            select:{
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({user},{status:st2xx.ok});

    }catch(e){
        console.error(`${e.name} ${e.message} \n ${e.stack}`);
        if(e.code && e.code == "P2025")
            return new NextResponse("Not found",{status:st4xx.notFound});
        return new NextResponse("internal Server error",{status:st5xx.internalServerError});
    }
}