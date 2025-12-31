import { User_register,flaterr } from "@/lib/authschema";
import { getToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse} from "next/server";
import { hasherpass } from "@/lib/hashpass";
import { st2xx,st4xx,st5xx } from "@/lib/responseCode";

/** 
 * @param {import ("next/server").NextRequest} request 
 */
export async function POST(request) {
    const rawdata = await request.json();
    const validate = User_register.safeParse(rawdata);

    if(!validate.success)
        return NextResponse.json(
            {message: flaterr(validate.error)},
            {status:st4xx.badRequest}
        );
    
    const finaldata = {...validate.data};
    finaldata.password = await hasherpass(finaldata.password);

    try{
        const user = await prisma.user.create({
            data:finaldata,
            select:{
                id:true,
                role:true
            }
        });
        
        const token = await getToken(user);

        return NextResponse.json(
            {token},
            {status:st2xx.ok}
        );

    }catch(e){
        console.error(`register user ERROR : ${e}`);
        return NextResponse.json(
            {message: "internal server error"},
            {status:st5xx.internalServerError}
        );
    }
}