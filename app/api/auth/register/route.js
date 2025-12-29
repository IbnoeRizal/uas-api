import { User_register,flaterr } from "@/lib/authschema";
import { getToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse} from "next/server";

/** 
 * @param {import ("next/server").NextRequest} request 
 */
export async function POST(request) {
    const rawdata = await request.json();
    const validate = User_register.safeParse(rawdata);

    if(!validate.success)
        return NextResponse.json(
            {message: flaterr(validate.error)},
            {status:400}
        );

    try{
        const user = await prisma.user.create({
            data:validate.data,
            select:{
                id:true,
                role:true
            }
        });
        
        const token = getToken(user);

        return NextResponse.json(
            {message: "token", token},
            {status:200}
        );

    }catch(e){
        console.error(`register user ERROR : ${e}`);
        return NextResponse.json(
            {message: "internal server error"},
            {status:500}
        );
    }
}