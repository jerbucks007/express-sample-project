import toobusyJs from 'toobusy-js';
import { logger } from '../../resources/functions';

export default (req, res, next) => {
  if (toobusyJs()) {
    logger.ERROR({ error: 'The server is too busy' }, ' server is too busy ', 'route-toobusy.js');
    return res.status(503).send('Service Unavailable, server too busy');
  }
  next();
};
