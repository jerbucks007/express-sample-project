
import configs from '../../configs';
import request from './api-request';
import functions, { logger } from '../../resources/functions';

const constructParam = (data) => {
  return {
    PlayerId : data.clients.clientId,
    TransactionId : data.txnDetId
  }
}

/**
 * @function checkBet
 * @description check running bet in the house.
 * @param {Object} data information for api
 * @param {String} callFrom Where the method was called
 * @return {Object} The available balance of the user
 */

export default async (data, callFrom) => {
  try {
    const paramAPI = constructParam(data);
    // Name of the API
    const apiName = configs.api.checkBetAPI;
    const result = await request(apiName, callFrom, paramAPI);
    logger.NOTICE({ msg: result, paramAPI }, '[API] => CHECK BET', 'api-check-bet.js');
    return result;
  } catch (errCatch) {
    logger.ERROR({ error: 'Error CHECK BET', err: errCatch }, '[API] CHECK BET', 'api-check-bet.js');
    return errCatch;
  }
};
