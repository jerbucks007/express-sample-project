import objectEncrypter from 'object-encrypter';
import configs from '../../../configs';
import * as _variable from './general-variable';
import logger from '../function-log';

/**
 * @function isObject
 * @description check if a variable is an object
 * @param {Any} the variable
 * @return {Boolean} true if an object, vice versa 
 */
export const isObject = (object) => _variable.isObject(object);

/**
 * @function isObjectHas
 * @description check if an object has specific property
 * @param {Object} the object
 * @param {String} attribute needed to be checked
 * @return {Boolean} true if the attribute exist, vice versa 
 */
export const isObjectHas = (object, property) => _variable.isObjectHas(object, property);

/**
 * @function encryptObject
 * @description encrypt object into a string
 * @param {Object} object that will be encrypted as a string
 * @param {Boolean} true if using TTL, vice versa
 * @return {String} Encrypted object
 */
export const encryptObject = (anyObject, useTTL) => {
  let tokenEngine = objectEncrypter(configs.main.encrypterSecret, { ttl: true });
  let encryptedObject = tokenEngine.encrypt(anyObject, configs.interval.tokenTTL);
  if (!useTTL) {
    tokenEngine = objectEncrypter(configs.main.encrypterSecret);
    encryptedObject = tokenEngine.encrypt(anyObject);
  }

  return encodeURIComponent(encryptedObject);
};

/**
 * @function decryptObject
 * @description decrypt a token into an object
 * @param {String} Encrypted object
 * @param {Boolean} true if using TTL, vice versa
 * @return {Object} Decrypted object, null if failed
 */
export const decryptObject = (encryptedObject, useTTL) => {
  let result = null;
  const stringObject = decodeURIComponent(encryptedObject);
  let decryptedObject = null;

  try {
    let tokenEngine = objectEncrypter(configs.main.encrypterSecret, { ttl: true });
    if (!useTTL) {
      tokenEngine = objectEncrypter(configs.main.encrypterSecret);
    }
    decryptedObject = tokenEngine.decrypt(stringObject);
  } catch (err) {
    logger.ERROR({ error: 'failed to decrypt', encryptedObject }, 'decryptToken method error', 'function-general-object.js');
  }
  if (decryptedObject !== null) {
    result = decryptedObject;
  }
  return result;
};

