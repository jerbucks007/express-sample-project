import models from '../../../../models';
import dbController from '../db-controller';
import logger from '../../function-log';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, bulkWrite, remove, increment, count } = dbController(models.main.playerBets, 'playerBets');

export const updateBets = async (condition, params, isMulti) => {
  if (isMulti) {
    return await models.main.playerBets.updateMany(condition, params).catch(errMsg => {
      logger.ERROR({ errMsg, condition, params, isMulti }, 'playerBets update multi method', 'db-player-bets.js');
      return null;
    });
  }

  // Execute when isMulti -> false
  return await models.main.playerBets.update(condition, params, { new: true }).catch(errMsg => {
    logger.ERROR({ errMsg, condition, params, isMulti }, 'playerBets update single method', 'db-player-bets.js');
    return null;
  });
};

export const getLastBet = async (condition, sortBy, limit) =>
  await models.main.playerBets.find(condition).sort(sortBy).limit(limit);

export const findSortHistory = async (condition, select, sortBy, isMulti , limitBy) => {
  if (isMulti) {
    return await models.main.playerBets.find(condition).select(select)
      .limit(limitBy)
      .sort(sortBy)
      .lean()
      // .slaveOk()
      // .read('secondaryPreferred')
      .catch(errMsg => {
        logger.ERROR({ errMsg, condition, isMulti }, 'playerBets find multi method', 'db-player-bets.js');
        return null;
      });
  }
};
