import { jwtVerify, SignJWT } from 'jose';
/** @typedef {import('@prisma/client').Role} Role */

const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<object> | null}
 */
export async function getUserFromRequest(req) {
    const auth = req.headers.get('authorization')
    if (!auth) return null

    const token = auth.replace('Bearer ', '')

  try {
    const { payload } = await jwtVerify(
      token,
      secret_key
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
 * @returns {Promise<string>}
 */
export async function getToken(params) {
    
    if(!(params.id && params.role))
      throw new Error(`params invalid ${params}`);
      
    return await new SignJWT(
      {
        id:params.id,
        role:params.role
      }
    )
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime("1 h")
      .sign(secret_key);
    
}