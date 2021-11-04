import functions from '../../resources/functions';
import configs from '../../configs';
import classes from '../../resources/classes';
import routeAuthToken from '../middlewares/route-auth-token';
import constantMaxPayout from '../../resources/constants/constant-max-payout';

export default (app) => {
  app.get('/tableB', routeAuthToken, async (req, res) => {
    const token = req.query.t || req.body.t;
    const gameToken = functions.general.object.decryptObject(token);
    const user = await functions.db.playerSessions.findWithPopulate({ _id: gameToken.psid });
    // Add the session to req
    req.session.playerSession = user;
    return res.send({ err: false, msg: 'success' });
    // return res.render('desktop/')
  });

  app.get('/table', routeAuthToken, async (req, res) => {
    // const referer = req.get('Referer');
    // if (referer === undefined) return res.redirect(`${configs.express.apiPrefix}/404`);
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    if (!req.query.t) return res.redirect(`${configs.express.apiPrefix}/404`);
    const gameToken = functions.general.object.decryptObject(req.query.t);
    if (!gameToken || !gameToken.psid) return res.redirect(`${configs.express.apiPrefix}/404`);

    const host = req.get('Host');
    const user = await functions.db.playerSessions.findWithPopulate({ _id: gameToken.psid });
    if (!user) return res.redirect(`${configs.express.apiPrefix}/404`);

    if (!user.refActiveUser || (user.pos === -1 && user.idleCounter > configs.interval.idleLimit) || (user.state > 0)) {
      const query = !user.refActiveUser && user ? { _id: user._id } : { refActiveUser: user.refActiveUser._id };
      await functions.db.playerSessions.remove(query, true);
      const lobbyToken = new Date().getTime() + 30000;
      return res.redirect(configs.main.getLobbyAddress(host, lobbyToken));
    }
    // Add the session to req
    req.session.playerSession = user;

    const routeChanger = new classes.routeChanger();
    if (!req.session.playerSession) return res.redirect(`${configs.express.apiPrefix}/404`);

    let rsName = host;
    let arsName = host;
    const isMobile = user.refActiveUser.isMobile;
    let jadeFile = '';
    if (configs.main.isTest) {
      const jadePath = (isMobile === 'true' || isMobile == true) ? '_sbo/mobile/' : '_sbo/desktop/';
      jadeFile = `${jadePath}main`;
    } else {
      const fullHostName = rsName.split('.');
      rsName = `${configs.main.rsPrefix + fullHostName[1]}.${fullHostName[2]}${configs.main.rsPostfix}`;
      arsName = `${configs.main.arsPrefix + fullHostName[1]}.${fullHostName[2]}`;
      const appID = user.refActiveUser.siteId;
      jadeFile = routeChanger.getRoute('main', appID, isMobile);
    }
    return res.render(jadeFile, {
      user: {
        displayname: user.refActiveUser.displayname,
        avatar: user.refActiveUser.avatar,
        token: user.refActiveUser.token,
        sessionID: user.refActiveUser.sessionId,
        clientID: user.refActiveUser.clientId,
        lang: user.refActiveUser.lang,
        homeUrl : user.refActiveUser.homeUrl,
        loginUrl : user.refActiveUser.loginUrl,
        exchangeRate: {
          currencyCode: user.exchangeRate.currencyCode,
          name: user.exchangeRate.name,
          value: user.exchangeRate.value,
        },
        isMuted: user.refActiveUser.settings.isMute || false,
      },
      gTag : configs.main.gTag,
      table: user.tableId,
      computedMaxPayout: constantMaxPayout[user.exchangeRate.currencyCode],
      rs: `${configs.main.protocol}://${rsName}`,
      ars: `${configs.main.protocol}://${arsName}`,
      ws: configs.express.apiPrefix,
      v: configs.main.appVersion,
      t: 'Dragon Tiger Multiplayer Table',
    });
  });

};
