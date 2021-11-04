import models from '../../../../models';
import dbController from '../db-controller';
import logger from '../../function-log';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, remove, increment, count } = dbController(models.main.playerSessions, 'playerSessions');

/**
 * @function findWithPopulate
 * @description This will find the existing document in the DB.
 * @param {Object} condition An object that contains queries
 * @param {String} select This will include the specific filed in the document
 * @param {Boolean} isMulti Checker if finding of collection is many or single
 * @returns This return an {Object} if successfully execute, null if not
 */
export const findWithPopulate = async (condition, select, isMulti) => {
  if (isMulti) {
    return await models.main.playerSessions.find(condition).populate('refActiveUser').select(select).catch(errMsg => {
      logger.ERROR({ errMsg, condition, isMulti }, 'playerSessions find multi method', 'db-controller.js');
      return null;
    });
  }

  // Execute when isMulti -> false
  return await models.main.playerSessions.findOne(condition).populate('refActiveUser').select(select).catch(errMsg => {
    logger.ERROR({ errMsg, condition, isMulti }, 'playerSessions find single method', 'db-controller.js');
    return null;
  });
};

export const updateIdleCounter = async (condition, params, isMulti) => {
  if (isMulti) {
    return await models.main.playerSessions.updateMany(condition, params).catch(errMsg => {
      logger.ERROR({ errMsg, condition, isMulti }, 'playerSessions updateIdleCounter method', 'db-controller.js');
      return null;
    });
  }
};
