import { logger } from '../../resources/functions';
import configs from '../../configs';

export default (req, res) => {
  logger.ERROR({ method: req.method, url: req.url }, 'error routes request', 'route-errorRoutes.js');
  if (req.accepts('html')) return res.redirect(`${configs.express.apiPrefix}/404`);
  // respond with json
  if (req.accepts('json')) return res.send({ error: 'Not found' });
  return res.status(404).send('Page not found');
};
