import { getUserFromRequest } from "./lib/auth";
import { NextResponse } from "next/server";
import { st4xx, st5xx } from "./lib/responseCode";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

/** @param {import("next/server").NextRequest} request */
export async function proxy(request,context) {


  const userIp = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const { success, pending } = await ratelimit.limit(userIp);

  if(process.env.NEXT_RUNTIME === "edge")
    context.waitUntil(pending);

  if(!success){
    return new NextResponse("Too Many Requests", {status: st4xx.tooManyRequest});
  }

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