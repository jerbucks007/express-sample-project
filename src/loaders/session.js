import express from 'express';
import crypto from 'crypto';
import CookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import ExpressSession from 'express-session';

import models from '../models';

export default async ({ configs }) => {
  // Initialized the session store options
  const sessionStoreOptions = {
    mongooseConnection: models.main.connection,
    collection: 'sessions',
    ttl: configs.interval.sessionMaxAge,
    transformId(sessionID) {
      return crypto.createHash('sha1').update(configs.main.saltSettings + sessionID).digest('hex');
    },
  };
  // Connect the express session to mongo store
  const MongoStore = connectMongo(ExpressSession);

  // Select the type of the session
  const sessionStore = (configs.express.useMongoSession) ?
    new MongoStore(sessionStoreOptions) :
    new express.session.MemoryStore();

  // The session that will be use for express
  const expressSession = configs.express.expressSession(ExpressSession, sessionStore);

  // cookie parser
  const cookieParser = CookieParser(configs.main.COOKIE_SECRET);

  return { sessionStore, expressSession, cookieParser };
};
