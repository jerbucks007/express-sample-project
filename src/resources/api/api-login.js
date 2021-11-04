
import configs from '../../configs';
import request from './api-request';
import logger from '../functions/function-log';

/**
 * @function login
 * @description Do Login from real player or bot to Onyx PS
 * @param	{String} token This is the token generated frpom PS
 * @param	{String} callFrom This is where the method was called
 * @param	{Function} next Callback fuction
 * @return {Object} This will return the information of player 
 */
export default async (token, callFrom) => {
  try {
    // Params needed to be able to login from the house (338a)
    const paramAPI = {
      server_id: configs.api.serverId,
      token,
    };
    // Name of the API
    const apiName = configs.api.loginAPI;
    const result = await request(apiName, callFrom, paramAPI);
    logger.NOTICE({ msg: result, paramAPI }, '[API] => LOGIN', 'api-login.js');
    return result;
  } catch (errCatch) { // trycatch error
    logger.ERROR({ error: 'catch error when getting response from API', err: errCatch }, '[RPS] API LOGIN', 'function-api-login.js');
    return errCatch;
  }
};
