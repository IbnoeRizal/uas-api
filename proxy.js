import { getUserFromRequest } from "./lib/auth";
import { NextResponse } from "next/server";
import { st4xx } from "./lib/responseCode";

/** @param {import("next/server").NextRequest} request */
export async function proxy(request) {
  const user = await getUserFromRequest(request);
  const {pathname} = request.nextUrl;
  if (user || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  return new NextResponse("Unauthorized", {
    status: st4xx.unauthorized,
    headers: {
      "WWW-Authenticate": 'Bearer realm="registered", error="invalid_token"'
    }
  });
}

export const config = {
    matcher : '/api/:path*'
}