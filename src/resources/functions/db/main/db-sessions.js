import models from '../../../../models';
import dbController from '../db-controller';
import general from '../../general';
import * as _activeUsers from './db-active-users';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, remove, count } = dbController(models.main.sessions, 'sessions');

/**
 * @function checkSession
 * @description check if player session is active or expired/invalid
 * @param {String} player session
 * @param {Function} callback function
 * @return {Boolean} true if still active, vice versa
 */
export const checkSession = async (session) => {
  if (general.variable.sessionChecker(session)) {
    const isActive = await _activeUsers.validateActiveUser(session.playerSession.refActiveUser);
    const avtiveUserQuery = { _id: session.playerSession.refActiveUser._id };
    if (isActive) {
      const isSuccess = await _activeUsers.update(avtiveUserQuery, { activeOn: new Date() });
      if (isSuccess) {
        session.playerSession.refActiveUser = isSuccess;
        session.touch().save();
        return true;
      }
      return false;
    }
    await _activeUsers.remove(avtiveUserQuery, false);
    return false;
  }
  return false;
};
