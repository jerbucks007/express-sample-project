import configs from '../../configs';
import request from './api-request';
import logger from '../functions/function-log';

const constructParam = (data) => {
    return {
      PlayerId : data.clients.clientId,
      TransactionId : data.txnDetId
    }
};
/**
 * @function cancelBet
 * @description Cancel bet transaction from the house.
 * @param {Object} data information for api
 * @param {String} callFrom Where the method was called
 * @return {Object} The TransactionId
 */
export default async (data, callFrom) => {
  try {
    const paramAPI = constructParam(data);
    // Name of the API
    const apiName = configs.api.cancelBetAPI;
    const result = await request(apiName, callFrom, paramAPI);
    logger.NOTICE({ msg: result, paramAPI }, '[API] => CANCEL BET', 'api-cancelbet.js');
    return result;
  } catch (errCatch) {
    logger.ERROR({ error: 'Error cancelBet bet', err: errCatch }, '[API] CANCEL BET', 'api-cancelbet.js');
    return errCatch;
  }
};
