import mongoose from 'mongoose';
import connectionHandler from '../connection-handler';
import configs from '../../configs';

// MODELS
import activeUserModel from './model-active-users';
import counterModel from './model-counters';
import exchangeRateModel from './model-exchange-rates';
import gameReportModel from './model-game-reports';
import gameTokenModel from './model-game-tokens';
import playerBetHistoryModel from './model-player-bet-histories';
import playerBetModel from './model-player-bets';
import playerSessionModel from './model-player-sessions';
import sessionModel from './model-sessions';
import tableChipsModel from './model-table-chips';
import tableLimitModel from './model-table-limits';
import tableModel from './model-tables';
import userDataModel from './model-user-datas';
import playerLogsModel from './model-player-logs';

let mongooseOptions = Object.assign({} , configs.db.mongooseOptions);
if (configs.main.ENV === 'PRD') { 
  mongooseOptions.pass = 'YdEtO^\TjR!oY*WNNrCE';
  mongooseOptions.replicaSet = 'bunce';
}

const connetionHandlerConfig = {
  dbConnectionPath: configs.db.dbConnectionPath,
  mongooseOptions: mongooseOptions,
  dbName: configs.db.dbName,
};
const connection = connectionHandler(configs.db.dbConnectionPath, mongooseOptions, connetionHandlerConfig);

/**
 * Add the models here
 */

// const house = configs.main.getHouse();
// const counters = house === 'SBO' ? _centralPoint.svyCoutners : counterModel(mongoose, connection);
const counters = counterModel(mongoose, connection);
const activeUsers = activeUserModel(mongoose, connection);
const exchangeRates = exchangeRateModel(mongoose, connection);
const gameReports = gameReportModel(mongoose, connection);
const gameTokens = gameTokenModel(mongoose, connection);
const playerBetHistory = playerBetHistoryModel(mongoose, connection);
const playerBets = playerBetModel(mongoose, connection, counters);
const playerSessions = playerSessionModel(mongoose, connection);
const sessions = sessionModel(mongoose, connection);
const tableChips = tableChipsModel(mongoose, connection);
const tableLimits = tableLimitModel(mongoose, connection);
const tables = tableModel(mongoose, connection);
const userDatas = userDataModel(mongoose, connection);
const playerLogs = playerLogsModel(mongoose, connection);

export default {
  connection,
  activeUsers,
  counters,
  exchangeRates,
  gameReports,
  gameTokens,
  playerBetHistory,
  playerBets,
  playerSessions,
  sessions,
  tableChips,
  tableLimits,
  tables,
  userDatas,
  playerLogs,
};
