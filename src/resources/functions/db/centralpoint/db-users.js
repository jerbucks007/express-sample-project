import models from '../../../../models';
import general from '../../general';
import dbController from '../db-controller';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, bulkWrite, remove, increment, count } = dbController(models.centralpoint.users, 'user');

/**
 * @function changePassword 
 * @description This will change the password of the user
 * @param {String} username Username to be change password 
 * @param {String} password New password
 * @returns This returns an Object if success, false if not
 */
export const changePassword = async (username, password) => {
  const newPassword = await general.password(password);
  if (newPassword) {
    const pwdUpdate = await update({ username }, newPassword, false);
    return !!pwdUpdate;
  }
  return false;
};

/**
 * @function authenticate
 * @description This will check if the user credential is authorize
 * @param {String} username Username to authenticate
 * @param {String} password Password to authenticate
 * @returns This return the user data if success, false||null if not.
 */
export const authenticate = async (username, password) => {
  const user = await find({ username }, false);
  if (user) {
    const pwd = await general.password(password, user.salt);
    if (user.hash === pwd.hash) return user;
    return false || null;
  }
  return false || null;
};
