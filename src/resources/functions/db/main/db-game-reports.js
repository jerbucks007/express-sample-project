import models from '../../../../models';
import dbController from '../db-controller';
import logger from '../../function-log';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, remove, count } = dbController(models.main.gameReports, 'gameReports');

export const findSort = async (condition, select, sortBy, isMulti) => {
  if (isMulti) {
    return await models.main.gameReports.find(condition).select(select)
      .sort(sortBy)
      .lean()
      // .slaveOk()
      // .read('secondaryPreferred')
      .catch(errMsg => {
        logger.ERROR({ errMsg, condition, isMulti }, 'gameReports find multi method', 'db-controller.js');
        return null;
      });
  }

  // Execute when isMulti -> false
  return await models.main.gameReports.findOne(condition).select(select)
    .sortBy(sortBy)
    .lean()
    // .slaveOk()
    // .read('secondaryPreferred')
    .catch(errMsg => {
      logger.ERROR({ errMsg, condition, isMulti }, 'gameReports find multi method', 'db-controller.js');
      return null;
    });
};
