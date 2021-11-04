import { Router } from 'express';
import {
  tableRoute, gotoLobbyRoute, healthCheckRoute,
  errorRoute, browseRoute, getLobbyUrl, gotoPrev,
} from './engines';

export default () => {
  const app = Router();

  gotoLobbyRoute(app);
  tableRoute(app);
  healthCheckRoute(app);
  errorRoute(app);
  browseRoute(app);
  browseRoute(app);
  getLobbyUrl(app);
  gotoPrev(app)

  return app;
};
