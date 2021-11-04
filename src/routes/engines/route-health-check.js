// import routeAsyncHandler from '../middlewares/route-async-handler';

export default (app) => {
  app.get('/scheck', async (req, res) => res.status(200).send('ok'));
};
