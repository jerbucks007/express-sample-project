import models from '../../../../models';
import dbController from '../db-controller';
import logger from '../../function-log';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, remove, count } = dbController(models.history.playerBetHistory, 'playerBetHistory');

export const findSortHistory = async (condition, select, sortBy, isMulti , limitBy) => {
    if (isMulti) {
      return await models.history.playerBetHistory.find(condition).select(select)
        .limit(limitBy)
        .sort(sortBy)
        .lean()
        // .slaveOk()
        // .read('secondaryPreferred')
        .catch(errMsg => {
          logger.ERROR({ errMsg, condition, isMulti }, 'playerBetHistory find multi method', 'db-player-bet-histories.js');
          return null;
        });
    }
};