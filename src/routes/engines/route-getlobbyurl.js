import functions from '../../resources/functions';
import configs from '../../configs';

export default (app) => {
  app.post('/getLobbyUrl', async (req, res) => {
    const host = req.get('Host');
    if (!req.session.playerSession) {
      return res.send({ url: configs.main.getStatementAddress(host), error: false });
    }else{
      res.send(404);
    }
  });
};
