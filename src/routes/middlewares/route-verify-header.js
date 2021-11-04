import configs from '../../configs';
import functions, { logger } from '../../resources/functions';

export default (req, res, next) => {
  // Disable the verification of header for local
  if (configs.main.isTest) return next();
  
  const session = req.session.playerSession;
  if (!session) return res.redirect(`${configs.express.apiPrefix}/405`);
  const tempip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ip = functions.general.ip.doSetIp(tempip);
  if (JSON.stringify(session.uAgent) === JSON.stringify(req.useragent)) {
    if (session.ip === ip) return next();
    if (functions.general.ip.subnetChecker(session.ip, ip)) return next();
    logger.ALERT({ error: 'ip not verified', ip: session.ip, headerIP: ip }, 'verify header method', 'route-verify-header');
    return next();
    // return res.redirect(`${configs.express.apiPrefix}/405`);
  }
  logger.ALERT({ error: 'user agent not verified', ip: session.ip, headerIP: ip }, 'verify header method', 'route-verify-header');
  return next();
};
