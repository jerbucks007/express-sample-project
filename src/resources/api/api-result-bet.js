
import configs from '../../configs';
import request from './api-request';
import logger from '../functions/function-log';

const constructParam = (data) => {
  return {
    TransactionId : data.txn_det_id ,
    BetResultReq : data.BetResultReq
  };
};
/**
 * @function resultBet
 * @description Record a transaction from the house.
 * @param {Object} data information for api
 * @param {String} callFrom Where the method was called
 * @return {Object} The list of evaluated player
 */
export default async (data, callFrom) => {
  try {
    const paramAPI = constructParam(data);
    // Name of the API
    const apiName = configs.api.resultBetAPI;
    const result = await request(apiName, callFrom, paramAPI);
    logger.NOTICE({ msg: result, paramAPI }, '[API] => RESULT BET', 'api-result-bet.js');
    return result;
  } catch (errCatch) {
    logger.ERROR({ error: 'Error result bet', err: errCatch }, '[API] RESULT BET', 'api-result-bet.js');
    return errCatch;
  }
};
