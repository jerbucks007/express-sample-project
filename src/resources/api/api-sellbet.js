
import configs from '../../configs';
import request from './api-request';
import functions, { logger } from '../../resources/functions';

const constructParam = (data) => {

  const gameId = data.clients.isMobile ? configs.api.gameIdFromSBOMobile : configs.api.gameIdFromSBODesktop;
  return {
    SessionId : data.clients.sessionId,
    PlayerIp : data.clients.playerIp,
    Bet : {
      GameCode : data.clients.gameCode,
      TransactionId : data.txnDetId,
      Stake : data.stake
    }
  };
  
};

/**
 * @function sellBet
 * @description Record a transaction from the house.
 * @param {Object} data information for api
 * @param {String} callFrom Where the method was called
 * @return {Object} The available balance of the user
 */

export default async (data, callFrom) => {
  try {
    const paramAPI = constructParam(data);
    // Name of the API
    const apiName = configs.api.sellBetAPI;
    const result = await request(apiName, callFrom, paramAPI);
    logger.NOTICE({ msg: result, paramAPI }, '[API] => SELL BET', 'api-sellbet.js');
    return result;
  } catch (errCatch) {
    logger.ERROR({ error: 'Error sell bet', err: errCatch }, '[API] SELL BET', 'api-sellbet.js');
    return errCatch;
  }
};
