import { getToken, getUserFromRequest } from "@/lib/auth";
import { st2xx, st4xx } from "@/lib/responseCode";
import { NextResponse } from "next/server";


/**
 * 
 * @param {import ("next/server").NextRequest} request
 * @returns {NextResponse}
 */
export async function GET(request) {
    const payload = await getUserFromRequest(request);
    if(!payload || !(payload.id && payload.role))
        return new NextResponse("Unauthorized",{status:st4xx.unauthorized});

    const token = await getToken(payload);
    return NextResponse.json({token},{status:st2xx.ok});
}