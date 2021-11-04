import models from '../../../../models';
import dbController from '../db-controller';
import logger from '../../function-log';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, remove, count } = dbController(models.main.tableChips, 'table_chips');

export const updateChips = async (condition, params, isMulti) => {
  if (isMulti) {
    return await models.main.tableChips.updateMany(condition, params).catch(errMsg => {
      logger.ERROR({ errMsg, condition, params, isMulti }, 'tableChips update multi method', 'db-table-chips.js');
      return null;
    });
  }

  // Execute when isMulti -> false
  return await models.main.tableChips.update(condition, params, { new: true }).catch(errMsg => {
    logger.ERROR({ errMsg, condition, params, isMulti }, 'tableChips update single method', 'db-table-chips.js');
    return null;
  });
};
