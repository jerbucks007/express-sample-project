import configs from '../../configs';
// import routeAsyncHandler from '../middlewares/route-async-handler';

export default (app) => {
  const route = (page) => async (req, res) => {
    if (!req.get('host')) return new Error(`Cant find the host! ${req.get('host')}`);

    let rsName = req.get('Host');
    // let rpName = rsName;
    // const referer = req.get('Referer');/

    if (!configs.main.isTest) {
      const fullHostName = rsName.split('.');
      rsName = `${configs.main.rsPrefix + fullHostName[1]}.${fullHostName[2]}${configs.main.rsPostfix}`;
      // const resx = (referer) ? referer.split('/') : '';
      // rpName = (resx[2]) ? resx[2] : `${configs.main.refererPrefix + fullHostName[1]}.${fullHostName[2]}`;
    }
    return res.render(page, {
      rs: `${configs.main.protocol}://${rsName}`,
      // rp: `${configs.main.protocol}://${rpName}`,
    });
  };

  app.get('/404', route('404'));
  app.get('/405', route('405'));
  app.get('/500', route('500'));
};
