import _configMain from './config-main';
import _configInterval from './config-interval';

export default {

  // prefix for the API that will be used in the routes
  apiPrefix: _configMain.getHouse() === 'SBO' ? `/svy/dtmt${_configMain.serverId}` : `/dtmt${_configMain.serverId}`,

  // Static patch for the public folder
  static_path: '../../public',

  // Path for the views
  view_path: '../../views',

  // view engine (can use jade or pug)
  view_engine: 'pug',

  // view options
  view_options: { layout: false },

  // view cache, set it false if you don't want to keep restart (LAB/UAT/PRD must true)
  view_cache: false,

  bodyParserJSON: { limit: '2mb' },

  bodyParserUrlEncode: { limit: '2mb', extended: true },

  errorHandler: { dumpExceptions: true, showStack: true },

  cors: { creditials: true },

  // socket io transport options
  io_transports: ['websocket'],

  // socket io heartbeat interval
  io_heartbeat_interval: 1500,

  // socket io heartbeat timeout
  io_heartbeat_timeout: 15000,

  // socket io shared session config 
  io_shared_session: { autoSave: true },

  useMongoSession: true,
  expressSession(ExpressSession, sessionStore) { // express session config
    const expressSession = ExpressSession({
      store: sessionStore,
      cookie: _configMain.isHttp ? { httpOnly: true } : { httpOnly: true, secure: true, maxAge: _configInterval.cookieMaxAge },
      rolling: true,
      resave: true,
      saveUninitialized: false,
      secret: _configMain.COOKIE_SECRET,
      key: _configMain.EXPRESS_SID_KEY,
    });
    return expressSession;
  },
};
