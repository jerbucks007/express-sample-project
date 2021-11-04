
import configs from '../../configs';
import request from './api-request';
import logger from '../functions/function-log';

const constructParam = (data) => {
  return {
    SessionId : data.sessionId,
    PlayerId : data.clientId
  }
};
/**
 * @function availableBalance
 * @description This will get the balance of player from the house
 * @param {Object} data information for api
 * @param {String} callFrom Where the method was called
 * @return {Object} The available balance of the user
 */
export default async (data, callFrom) => {
  try {
    const paramAPI = constructParam(data);
    // Name of the API
    const apiName = configs.api.availableBalanceAPI;
    const result = await request(apiName, callFrom, paramAPI);
    logger.NOTICE({ msg: result, paramAPI }, '[API] => AVAILABLE BALANCE', 'api-available-balance.js');
    return result;
  } catch (errCatch) {
    logger.ERROR({ error: 'Error getting available balance', err: errCatch }, '[API] AVAILABLE BALANCE', 'api-available-balance.js');
    return errCatch;
  }
};
