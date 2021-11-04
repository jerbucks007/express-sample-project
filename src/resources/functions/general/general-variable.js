import logger from '../function-log';

/**
 * @function isNumber
 * @description check if a variable is a number
 * @param {Number} the variable
 * @return {Boolean} true if n is a number, vice versa
 */
export const isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * @function isNotEmpty
 * @description check if a variable is not null / undefined
 * @param {Any} the variable
 * @return {Boolean} true if not null/undefined, vice versa 
 */
export const isNotEmpty = function (variable) {
  if (variable === null || variable === undefined) return false;
  return true;
};

/**
 * @function isString
 * @description check if a variable is a string
 * @param {Any} the variable
 * @return {Boolean} true if a string, vice versa 
 */
export const isString = function (variable) {
  if (typeof variable !== 'string') return false;
  return true;
};

/**
 * @function isBoolean
 * @description check if a variable is a boolean
 * @param {Any} the variable
 * @return {Boolean} true if a boolean, vice versa 
 */
export const isBoolean = function (variable) {
  if (typeof variable !== 'boolean') return false;
  return true;
};

/**
 * @function isArray
 * @description check if a variable is an array
 * @param {Any} the variable
 * @return {Boolean} true if an array, vice versa 
 */
export const isArray = function (variable) {
  return Array.isArray(variable);
};

/**
 * @function isObject
 * @description check if a variable is an object
 * @param {Any} the variable
 * @return {Boolean} true if an object, vice versa 
 */
export const isObject = function (object) {
  return ((typeof object).toLowerCase() === 'object');
};

/**
 * @function isObjectHas
 * @description check if an object has specific property
 * @param {Object} the object
 * @param {String} attribute needed to be checked
 * @return {Boolean} true if the attribute exist, vice versa 
 */
export const isObjectHas = function (object, property) {
  // make sure it an object first
  const isObj = isObject(object);
  if (isObj) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  return false;
};

/**
 * @function socketChecker
 * @description check if the socket is a valid object
 * @param {Object} the socket object
 * @param {[String]} array of property needed to be checked, null or [] if want to skip the checking.
 * @return {Boolean} true if the socket is valid, vice versa 
 */
export const socketChecker = function (socket, properties) {
  let result = true;
  if (!isNotEmpty(socket)) {
    result = false;
  } else if (properties) {
    for (let i = 0; i < properties.length; i++) {
      if (!isObjectHas(socket, properties[i])) {
        result = false;
        break;
      }
    }
  }

  return result;
};

/**
 * @function sessionChecker
 * @description check if the session is a valid object, if still valid, touch it
 * @param {Object} the session object
 * @return {Boolean} true if the session is valid, vice versa 
 */
export const sessionChecker = function (session) {
  if (!isNotEmpty(session)) {
    logger.NOTICE({ alert: 'session object is null/undefined' }, 'sessionChecker method alert', 'function-general-variable.js');
    return false;
  } else if (!isObjectHas(session, 'playerSession')) {
    logger.NOTICE({ alert: 'session object has no "user" property' }, 'sessionChecker method alert', 'function-general-variable.js');
    return false;
  } else if (!isNotEmpty(session.playerSession)) {
    logger.NOTICE({ alert: 'session.user is object null/undefined' }, 'sessionChecker method alert', 'function-general-variable.js');
    return false;
  }
  return true;
};

/**
 * @function createUsername
 * @description create a username for new player
 * @param {Number} the counter
 * @param {String} house prefix
 * @return {String} new unique username
 */
export const createUsername = function (num, prefix) {
  const limit = 7;
  const transLength = 4;
  let stringResult = prefix;
  for (let i = transLength; i < limit; i++) {
    stringResult += '0';
  }
  stringResult += num;
  return stringResult;
};

/**
 * @function generateToken
 * @description This will generate new token for the game
 * @returns {String} This will retrun a string of generated tocken
 */
export const generateToken = () => {
  const x1 = new Date().getTime();
  const y1 = 30000; // 30 seconds limit
  const rand1 = x1 + y1;
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let gt = '';
  for (let i = 0; i < 4; i++) {
    gt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  gt += `.${rand1.toString()}`;
  return gt;
};

/**
 * @function generateRoundId
 * @description generate a game round id
 * @param {Number} number the counter
 * @return {String} new unique username
 */
export const generateRoundId = function (num, prefix) {
  const limit = (10 - prefix.toString().length);
  const transLength = num.toString().length;
  let stringResult = prefix.toString();
  for (let i = transLength; i < limit; i++) {
    stringResult += '0';
  }
  stringResult += num;
  return stringResult;
};
