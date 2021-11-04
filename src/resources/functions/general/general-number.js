import BigDecimal from 'big.js';
import * as _variable from './general-variable';
import configs from '../../../configs';

/**
 * @function isNumber
 * @description check if a variable is a number
 * @param {Number} the variable
 * @return {Boolean} true if n is a number, vice versa
 */
exports.isNumber = function (n) {
  return _variable.isNumber(n);
};

/**
 * @function detectComma
 * @description detect if a number has comma or not
 * @param {Number} the number
 * @return {Number} true if it has comma, vice versa
 */
exports.detectComma = function (number) {
  return String(number).indexOf('.') !== -1;
};

/**
 * @function decimalPlaces
 * @description count the total decimalPlaces of a number
 * @param {Number} the number
 * @return {Number} number of decimal places
 */
exports.decimalPlaces = function (num) {
  return String(num).split('.')[1].length;
};

/**
 * @function bigDecimals
 * @description do big decimals operations
 * @param {String} operations
 * @param {Number} left number
 * @param {Number} right number
 * @return {Number} Result
 */
exports.bigDecimals = function (op, leftNumber, RightNumber) {
  const x = new BigDecimal(leftNumber);
  const y = new BigDecimal(RightNumber);
  let z = null;
  if (op === 'add') z = x.plus(y).toString();
  else if (op === 'sub') z = x.minus(y).toString();
  else if (op === 'mul') z = x.times(y).toString();
  else if (op === 'div') z = x.div(y).toString();
  return Number(z);
};

/**
 * @function numberManipulator
 * @description make a number fixed/ceil/round number on certain decimal places
 * @param {Number} the number
 * @param {Number} number of decimal places
 * @param {Number} 0 = fixed, 1=ceil, 2=round
 * @return {Number} number with desired decimal places
 */
exports.numberManipulator = function (num, dec, type) {
  const decimals = Math.pow(10, dec);
  const baseDecimal = exports.bigDecimals('mul', Number(num), Number(decimals));
  let x = 0;
  if (type === 0) x = exports.bigDecimals('div', Math.floor(baseDecimal), Number(decimals));
  else if (type === 1) x = exports.bigDecimals('div', Math.ceil(baseDecimal), Number(decimals));
  else if (type === 2) x = exports.bigDecimals('div', Math.round(baseDecimal), Number(decimals));

  x = x.toFixed(dec);
  return Number(x);
};

/**
 * @function setDecimalPlaces
 * @description set max decimal places in a number
 * @param {Number} the number
 * @param {Number} max decimal places
 * @param {Boolean} true if floor, false if round
 * @return {Number} number with max decimal places
 */
exports.setDecimalPlaces = function (num, dec, isFixed) {
  let number = num;
  const hasDecimals = exports.detectComma(number);
  if (hasDecimals) {
    const totalDecimals = exports.decimalPlaces(number);
    if (totalDecimals > dec) {
      number = number.toFixed(dec + 1);
      if (isFixed) number = exports.numberManipulator(Number(number), dec, 0);
      else number = exports.numberManipulator(Number(number), dec, 2);
      return Number(number);
    }
    number = number.toFixed(dec);
    return Number(number);
  }
  return Number(number);
};

/**
 * @function lurkDecimal
 * @description make a number loaded based on application config for decimal places
 * @param {Number} the number
 * @param {Boolean} true if floor, false if round
 * @return {Number} number with application decimals places config
 */
exports.lurkDecimal = function (value, isFixed) {
  const dec = configs.decimal.totalDecimals;
  return exports.setDecimalPlaces(value, dec, isFixed);
};

/**
 * @function lurkAPIDecimal
 * @description do calculation before passing through the API
 * @param {Number} the number
 * @param {Boolean} true if multiplying, false if dividing
 * @param {Number} conversion value
 * @return {Number} the result number
 */
exports.lurkAPIDecimal = function (num, isMultiply, conversion) {
  const dec = configs.decimal.APITotalDecimals;
  const diff = dec - configs.decimal.totalDecimals;
  const decimals = (conversion) ? Number(conversion) : Math.pow(10, diff);
  let number = num;
  if (isMultiply) number = exports.bigDecimals('mul', Number(number), Number(decimals));
  else number = exports.bigDecimals('div', Number(number), Number(decimals));
  return exports.setDecimalPlaces(number, dec, true);
};

/**
 * @function getFormatParamTxnId
 * @description to get Format Param TxnId to request API Onyx
 * @param {Integer} gameId Current game Id of the game
 * @param {Integer} idIncrement Table ID
 * @return {Integer} txnIdParam
 */
exports.getFormatTxnId = function (gameId, idIncrement) {
  /**  Format ===> 100011 
	 * -> 10001 is id increment of table
	 * -> 1 (last) is game id of game in the table
	 * */
  const txnIdParam = idIncrement.toString() + gameId.toString();
  
  // eslint-disable-next-line radix
  return parseInt(txnIdParam);
};
