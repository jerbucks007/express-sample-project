import configs from '../../configs';
import request from './api-request';
import logger from '../functions/function-log';

const constructParam = (data) => {

  const gameId = data.clients.isMobile ? configs.api.gameIdFromSBOMobile : configs.api.gameIdFromSBODesktop;
  return {
    serverId: configs.api.serverId,
    player: {
      playerId: data.clients.clientId,
      sessionId: data.clients.sessionId,
    },
    bets: {
      gameBet: {
        txnId: `${gameId}-${data.txnDetId}`,
        roundId: data.txnId,
        stake: data.totalAmount,
        winlost: 0,
        gameId,
        ip: data.clients.ip,
        transDate: new Date(),
        httpRef: data.clients.httpreff,
        status: 'R',
        subBets: {
          gameSubBet: [
            {
              subBetId: data.subBetId,
              unitStake: data.stake,
              betType: 1,
              betTypeCollection: 1,
              unitWinlost: 0,
              subBetStatus: 'R',
              result: 'result',
            },
          ],
        },
      },
    },
    updateBal: true,
    closeBet: false,
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
    const apiName = configs.api.subSellBetAPI;
    const result = await request(apiName, callFrom, paramAPI);
    logger.NOTICE({ msg: result, paramAPI }, '[API] => SUB-SELL BET', 'api-sub-sellbet.js');
    return result;
  } catch (errCatch) {
    logger.ERROR({ error: 'Error sub-sell bet', err: errCatch }, '[API] SUB-SELL BET', 'api-sub-sellbet.js');
    return errCatch;
  }
};
