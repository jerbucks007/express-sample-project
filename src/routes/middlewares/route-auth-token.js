import configs from '../../configs';
// import routeAsyncHandler from './route-async-handler';
import functions, { logger } from '../../resources/functions';

export default async (req, res, next) => {
  // Disable the token for LCL
  if (configs.main.isTest) return next();

  const t = decodeURIComponent(req.query.t);
  const dt = functions.general.object.decryptObject(t, true);
  const token = dt && dt.token ? dt.token : null;
  const psid = dt && dt.psid ? dt.psid : null;
  const table = dt && dt.table ? dt.table : null;
  const reconnect = dt && dt.reconnect ? dt.reconnect : null;

  if (!token || !psid || !reconnect || !table) {
    logger.ERROR({ error: 'Invalid token parameter', t }, 'authToken method error', 'route-authToken.js');
    return res.redirect(`${configs.express.apiPrefix}/405`);
  }

  const expiration = Number(token.split('.')[1]);
  const currentTime = new Date().getTime();

  // Check if token is expired
  if (currentTime > expiration) {
    logger.ERROR({ error: 'Token was expired', token, expiration, currentTime }, 'authToken method error', 'route-authToken.js');
    return res.redirect(`${configs.express.apiPrefix}/405`);
  }

  // Find the token from DB if token not expired
  const gameToken = await functions.db.gameTokens.find({ token, psid, table, expiration });
  if (gameToken) {
    logger.ERROR({ error: 'Token was already used!', token, expiration }, 'authToken method error', 'route-authToken.js');
    // Remove the game token
    await functions.db.gameTokens.remove({ psid, table }, true);
    return res.redirect(`${configs.express.apiPrefix}/405`);
  }
  // Save token to DB if not existing
  const saveToken = await functions.db.gameTokens.save({ token, psid, expiration, table });
  if (!saveToken) res.redirect(`${configs.express.apiPrefix}/404`);
  return next();
};
