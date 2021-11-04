import configs from '../../configs';
import functions from '../../resources/functions';

export default (app) => {
  app.get('/gotoPrev', async (req, res) => {
    if (req.session.playerSession) {
      const user = req.session.playerSession;
    	if (!user) return res.redirect(`${configs.express.apiPrefix}/404`);
      // logger.WARNING({ error: 'GO TO PREV TEST' user : user.refActiveUser.homeUrl}, 'go to prev route error', 'gotoPrev.js');
    	res.redirect(user.refActiveUser.homeUrl);
    }else{
      res.send(404);
    }
  });
};
