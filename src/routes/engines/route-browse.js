import functions, { logger } from '../../resources/functions';
import configs from '../../configs';

export default (app) => {
  app.get('/browse', async (req, res) => {
    try {
      if (functions.general.variable.sessionChecker(req.session)) {
        const session = req.session.playerSession.refActiveUser;
        const isValid = await functions.db.activeUsers.validateActiveUser(session);
        if (isValid) {
          const tempip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          const ip = functions.general.ip.doSetIp(tempip);
          const useragent = { ...req.useragent };
          const suseragent = { ...session.uAgent };
          delete useragent.geoIp;
          delete suseragent.geoIp;
          if (JSON.stringify(suseragent) === JSON.stringify(useragent)) {
            // browser still has valid session, user agent same, IP still same
            if (session.ip === ip) return res.send({ st: 0, err: null });
            // browser still has valid session, user agent same, IP still in same subnet
            if (functions.general.ip.subnetChecker(session.ip, ip)) return res.send({ st: 0, err: null });
            // IP is not verified 
            logger.WARNING({ error: 'ip not verified', session_ip: session.ip, header_ip: ip }, 'browse route error', 'route-browse.js');
            return res.send({ st: 0, err: null });
          }
          logger.WARNING({ error: 'user agent not verified', session_uagent: session.uAgent, header_uagent: useragent }, 'browse route error', 'route-browse.js');
          return res.send({ st: 0, err: null });
        }
        // Not Valid
        req.session.destroy(() => {
          res.clearCookie(`${configs.main.EXPRESS_SID_KEY}`, { path: '/' });
          res.send({ st: 1, err: 'invalid session' });
        });
        return;
      }
      logger.ERROR({ session: req.session, error: 'invalid session' }, 'browse route error', 'route-browse.js');
      req.session.destroy(() => {
        res.clearCookie(`${configs.main.EXPRESS_SID_KEY}`, { path: '/' });
        res.send({ st: 1, err: 'invalid session' });
      });
      return;
    } catch (errCatch) {
      logger.ERROR({ method: req.method, url: req.url, error: errCatch }, 'browse route catch error', 'route-browse.js');
      req.session.destroy(() => {
        res.clearCookie(`${configs.main.EXPRESS_SID_KEY}`, { path: '/' });
        res.send({ st: 1, err: 'invalid session' });
      });
      return;
    }
  });
};
