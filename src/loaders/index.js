import mongodbLoader from './mongodb';
import sessionLoader from './session';
import globalLoader from './globals';
import expressLoader from './express';
import socketLoader from './socketio';
import redisLoader from './redis';
import intervalLoader from './intervals';
import gameLoader from './game';

import logger from '../resources/functions/function-log';

export default async ({ app, server, configs }) => {
  try {
    // Waiting to load the database
    await mongodbLoader({ configs });
    logger.INFO('Database successfully conneceted', '[LOADED] [DB]', 'src/loaders/index.js');
    
    // Waiting to load all the sessions
    const { cookieParser, expressSession, sessionStore } = await sessionLoader({ configs });
    logger.INFO('Session successfully conneceted', '[LOADED] [SESSION]', 'src/loaders/index.js');
    
    // Waiting to load the globals
    await globalLoader();
    logger.INFO('Globals successfully conneceted', '[LOADED] [GLOBAL]', 'src/loaders/index.js');
    
    // Waiting to load the setup for express
    await expressLoader({ app, cookieParser, expressSession });
    logger.INFO('Express successfully conneceted', '[LOADED] [EXPRESS]', 'src/loaders/index.js');
    
    // Waiting to load the setup for socket io
    const io = await socketLoader({ server, expressSession, cookieParser, sessionStore });
    logger.INFO('Socket-IO successfully conneceted', '[LOADED] [SOCKET]', 'src/loaders/index.js');

    await redisLoader({ io });
    logger.INFO('Redis successfully conneceted', '[LOADED] [REDIS]', 'src/loaders/index.js');

    await intervalLoader({ io });
    logger.INFO('Redis successfully conneceted', '[LOADED] [INTERVAL]', 'src/loaders/index.js');

    await gameLoader({ io });
    logger.INFO('Redis successfully conneceted', '[LOADED] [GAME]', 'src/loaders/index.js');
  } catch (error) {
    console.error(error);
  }
};
