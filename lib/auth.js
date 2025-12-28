import { jwtVerify, SignJWT } from 'jose';
/** @typedef {import('@prisma/client').Role} Role */

export class Payload{
    /**
     * @param {number} id 
     * @param {Role} role 
     */
    constructor(id,role){

        /**@type {number} */
        this.id = Number(id);

        /**@type {Role} */
        this.role = role;
    }
}

/**
 * @param {import("next/server").NextRequest} req
 * @returns {Payload | null}
 */
export async function getUserFromRequest(req) {
    const auth = req.headers.get('authorization')
    if (!auth) return null

    const token = auth.replace('Bearer ', '')

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    return payload   // { id, role, .., ..}
  } catch (e){
    console.log(`error getuserpayload ${e}`);
    return null
  }
}

/**
 * @param {object} user 
 * @param {Array<string>} roles 
 */
export function requireRole(user, roles) {
  if (!user) {
    throw new Error('UNAUTHENTICATED')
  }

  if (!roles.includes(user.role)) {
    throw new Error('FORBIDDEN')
  }
}

/**
 * @param {object} params 
 * @returns {string}
 */
export async function getToken(params) {
    
    if(params.id && params.role)
      return await new SignJWT(new Payload(params.id,params.role))
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime("1 h")
        .sign(process.env.JWT_SECRET);
    
  throw new Error(`params invalid ${params}`);
}