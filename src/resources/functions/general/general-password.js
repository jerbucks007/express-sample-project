import crypto from 'crypto';

const digest = 'SHA512';
const len = 128; // Bytesize
const iterations = 12000; // set the iteration -- 12000 for ~300ms

/* 
 * @Function: hash
 * @Description: Hashes a password can be used for comparing or generating
 * @Param {String} password to hash
 * @Param {String} optional salt, no salt means generating new salt and hash
 * @Param {Function} callback
 */
export default async (pwd, salt) => {
  try {
    if (salt) { // this is for checking, will returning the hash, compare the hash
      const key = await crypto.pbkdf2Sync(pwd, salt, iterations, len, digest);
      const hash = key.toString('hex');
      return { hash };
    }
    // for generating new password, it will return salt and hash, save the new salt and hash
    const buffer = await crypto.randomBytes(len);
    salt = buffer.toString('base64');
    const key = await crypto.pbkdf2Sync(pwd, salt, iterations, len, digest);
    const hash = key.toString('hex');
    return { salt, hash };
  } catch (error) {
    return { error };
  }
};
