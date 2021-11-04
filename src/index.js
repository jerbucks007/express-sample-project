/***
 * 
 * @Author: Jerard Joseph Buencamino
 * @Company: Leekie Enterprises
 * @2019
 * @FilePath: src/index.js
 * @Version: 1.0.0
 * @Created: Wednesday, 23 October 2019
 * @Changes: -
 * @Desc: This is the main index of the application
 * 
 */
import express from 'express';
import http from 'http';
import https from 'https';

import configs from './configs';
import { logger } from './resources/functions';

(async () => {
  try {
    const app = express();
    // The type of server to be used if http or https
    const serverProtocol = configs.main.isHttp ? http : https;
    const server = configs.main.isHttp ?
      serverProtocol.createServer(app) :
      serverProtocol.createServer(configs.certificate.certOptions, app);

    // This will load all the setup for the application
    await require('./loaders').default({ app, server, configs });

    // Start the server
    server.listen(configs.main.port, configs.main.ipAddress, err => {
      if (err) {
        process.exit(1);
        return;
      }
      logger.INFO(`Server listening on port ${configs.main.ipAddress}:${configs.main.port}`, `[SERVER RUNNING] v${configs.main.appVersion}`, 'src/index.js');
    });
  } catch (e) {
    logger.ERROR(e, '[CATCH ERROR] MAIN', 'src/index.js');
    return e;
  }
})()
  .catch(e => {
    logger.ERROR(e, '[MAIN CATCH ERROR]', 'src/index.js');
    process.exit(1);
  });
