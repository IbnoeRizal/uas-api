import bcrypt from "bcryptjs";
/**
 * @type {Number}
 */
const saltlen = 10;

/**
 * 
 * @param {string} pass 
 */
export const hasherpass = function(pass){
    return bcrypt.hash(pass, saltlen)
}