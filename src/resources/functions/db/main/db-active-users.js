import models from '../../../../models';
import dbController from '../db-controller';
// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, remove, count } = dbController(models.main.activeUsers, 'active user');

/**
 * @function manageActiveUser
 * @description This will check if the user is existing if existing 
 * it will update the document, else create new document.
 * @param {Object} userObject An object that contains user information
 * @returns This return an {Object} if successfully execute, null if not
 */
export const manageActiveUser = async (userObject) => {
  const { userId, username } = userObject;
  // Find the the user from active user using centralpoint ID
  const user = await find({ userId });

  // No existing user
  if (!user) {
    const activeUser = await save(userObject);
    return activeUser || null;
  }

  // update the existing information of the active user 
  const isUpdateSuccess = await update({ clientId }, userObject, false);
  if (!isUpdateSuccess) return false;

  // Find the updated active user from the DB
  const updateUser = await find({ clientId }, false);
  return updateUser || null;
};

/**
 * @function validateActiveUser
 * @description check if active user still valid
 * @param {Object} userSession User session
 * @param {Function} callback Callback function
 * @return {Object} error object
 * @return {Boolean} true if valid, vice versa
 */
export const validateActiveUser = async (userSession) => {
  const { _id } = userSession;

  const user = await find({ _id }, 'activeOn', false);
  if (!user) return false;

  // Active user found, check the last active if still valid.
  const lastActiveOn = user.activeOn.getTime();
  const currentTime = new Date().getTime();

  // Check if the idle time is expired
  if ((lastActiveOn + (30 * 60000)) < currentTime) {
    // invalid
    await remove({ _id }, false);
    return false;
  }

  // valid
  return true;
};
