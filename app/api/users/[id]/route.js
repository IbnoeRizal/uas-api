import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { number } from "zod";

/**
 * @param {NextRequest} request 
 * @param {{ params: { id: string } }} context
 */
export async function GET(request,context) {
    try{
        const id = Number(( await context.params).id)
        const users = await prisma.user.findUnique({
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
            {message:users? users:"no user found"},
            {status: users? 200: 401}
        );
    }catch(e){
        console.error(e);
        return NextResponse.json({message:"internal server error"},{status:500})
    }
}