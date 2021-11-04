import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import serveStatic from 'serve-static';
import errorHandler from 'errorhandler';
import methodOverride from 'method-override';
import expressUseragent from 'express-useragent';
import serveFavicon from 'serve-favicon';
import path from 'path';
import helmet from 'helmet';

import routes from '../routes';
import routeMiddleware from '../routes/middlewares';
import configs from '../configs';

export default async ({ app, expressSession, cookieParser }) => {
  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  // app.enable('trust proxy');

  // setup the view engine that will be use
  app.set('views', path.join(__dirname, configs.express.view_path));
  app.set('view engine', configs.express.view_engine);
  app.set('view options', configs.express.view_options);
  app.set('view cache', configs.express.view_cache);

  app.use(morgan('tiny'));
  app.use(helmet());
  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json(configs.express.bodyParserJSON));
  app.use(bodyParser.urlencoded(configs.express.bodyParserUrlEncode));
  // app.use(multer().any());
  app.use(cookieParser);
  app.use(expressUseragent.express());
  app.use(compression());
  app.use(expressSession);
  app.use(methodOverride());
  app.use(serveStatic(path.join(__dirname, configs.express.static_path)));

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors({ creditials: true }));
  
  if (process.env.SAVVY_ENV === 'LCL') {
    app.use(serveFavicon(path.join(__dirname, configs.express.static_path, 'favicon.ico')));
    app.use(errorHandler(configs.express.errorHandler));
  }

  // load API routes
  app.use(configs.express.apiPrefix, routes());
  app.get('/favicon.ico', (req, res) => res.sendStatus(204));
  app.use(routeMiddleware.toobusy); // server too busy middleware
  app.use(routeMiddleware.errorRoutes); // error routes middleware
};
