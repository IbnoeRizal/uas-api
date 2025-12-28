import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { User_update, flaterr } from "@/lib/authschema";
import { hasherpass } from "@/lib/hashpass";

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

/**
 * @param {NextRequest} request 
 * @param {{ params: { id: string } }} context
 */
export async function PATCH(request, context) {

    try{
        const id = Number(await (context.params).id);
    
        const validate = User_update.safeParse(await request.json());

        if(!validate.success){
            return NextResponse.json({message: flaterr(validate.error)},{status:400})
        }
        
        const cp = {...validate.data};
        
        if(cp.password){
            cp.password = await hasherpass(cp.password);
        }

        const update = prisma.user.update({
            where:{id:id},
            data:cp,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        
        return NextResponse.json({message: `User updated successfully`, e}, {status:200});

    }catch(e){
        
        if (e.code === "P2025") {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.log(`PATCH ERROR: ${e}`);
        return NextResponse.json({message:"internal server error"},{status:500});
    }
    
}