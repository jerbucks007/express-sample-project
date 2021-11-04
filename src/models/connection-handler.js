import mongoose from 'mongoose';
import { logger } from '../resources/functions';

mongoose.Promise = require('bluebird');

export default (dbConnectionPath, mongooseOptions, options) => {
  const connection = mongoose.createConnection(dbConnectionPath, mongooseOptions);
  connection.then( res=> {
    connectionHandler(connection, options)
  }).catch( error => {
    logger.ERROR({ info: 'createConnection catch error' , dbConnectionPath : dbConnectionPath , error : error}, 'createConnection catch', 'connection-handler.js');
  })
  return connection;
};

const connectionHandler = (connection, _config) => {
  /**
   * DB RETRY CONNECTION
   */
  let hastry = false;
  const retryConnection = () => {
    hastry = true;
    connection = mongoose.createConnection(_config.dbConnectionPath, _config.mongooseOptions, (err) => {
      if (err) {
        // failed to connect, will retry again after 3 seconds
        logger.ERROR({ error: 'DB retry failed, will retry in 3 seconds', connectionPath: _config.dbConnectionPath, err }, `[DB] [ERROR] [${_config.dbName}]`, 'connection-handler.js');
        setTimeout(retryConnection, 3000);
      } else {
        global.CHECKDB = true;
        logger.DEBUG({ info: 'DB retry success', connectionPath: _config.dbConnectionPath }, ` [DB] [CONNECTED] ${_config.dbName}`, 'connection-handler.js');
        return connection;
      }
    });
  };
  /**
   * DB TERMINATE ALL CONNECTION
   */
  const terminateConnection = (type) => {
    connection.close(() => {
      logger.ERROR({ error: 'DB connection closed through app termination', connectionPath: _config.dbConnectionPath, type }, `${_config.dbName} DB connection error`, 'connection-handler.js');
      process.exit(0);
    });
  };
  /**
   * DB CONNECTION LISTENER
   */

  // connected
  connection.on('connected', () => {
    global.CHECKDB = true;
    logger.DEBUG({ info: 'DB connected', connectionPath: _config.dbConnectionPath }, `[DB] [CONNECTED] [${_config.dbName}]`, 'connection-handler.js');
  });

  // reconnected
  connection.on('reconnected', () => {
    global.CHECKDB = true;
    logger.DEBUG({ info: 'DB reconnected', connectionPath: _config.dbConnectionPath }, `[DB] [RECONNECTED] [${_config.dbName}]`, 'connection-handler.js');
  });

  // close
  connection.on('close', () => {
    logger.NOTICE({ info: 'DB closed', connectionPath: _config.dbConnectionPath }, `[DB] [CLOSED] [${_config.dbName}]`, 'connection-handler.js');
  });
  // disconnected
  connection.on('disconnected', () => {
    global.CHECKDB = false;
    logger.ERROR({ error: 'DB disconnected', connectionPath: _config.dbConnectionPath }, `[DB] [DISCONNECTED] [${_config.dbName}]`, 'connection-handler.js');
    connection.close();
    if (!hastry) retryConnection();
  });

  // error
  connection.on('error', err => {
    global.CHECKDB = false;
    logger.ERROR({ error: 'DB connection error', connectionPath: _config.dbConnectionPath, err }, `[DB] [ERROR] [${_config.dbName}]`, 'connection-handler.js');
    connection.close();
    if (!hastry) retryConnection();
  });

  // termination
  process.on('exit', () => terminateConnection('EXIT'));
  process.on('SIGINT', () => terminateConnection('SIGINT'));
  process.on('SIGUSR2', () => terminateConnection('SIGUSR2'));
  process.on('SIGTERM', () => terminateConnection('SIGTERM'));
};
