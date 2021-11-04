import models from '../../../../models';
import general from '../../general';
import dbController from '../db-controller';
import * as _counters from './db-counters';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, remove, count } = dbController(models.main.userDatas, 'user');

export const manage = async (userId) => {
  const userData = await find({ userId });
  if (!userData) {
    const avatar = Math.floor(Math.random() * 8);
    const suites = ['SPADE', 'HEART', 'CLOVER', 'DIAMOND', 'SPADE', 'HEART', 'CLOVER', 'DIAMOND'];
    const suite = suites[avatar];
    const seq = {};
    seq[`seq${global.HOUSE}`] = 1;
    const number = await _counters.increment({ _id: suite }, { $inc: seq });
    const displayname = general.variable.generateDisplayName(number[`seq${global.HOUSE}`], suite);
    const userDataObj = { userId, displayname, avatar };
    return await save(userDataObj);
  }
  return userData;
};
