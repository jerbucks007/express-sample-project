import mongoose from 'mongoose';
import connectionHandler from '../connection-handler';
import configs from '../../configs';

// MODELS
import gameReportHistoryModel from './model-game-report-histories';
import playerBetHistoryModel from './model-player-bet-histories';

let connection;
let gameReportHistory;
let playerBetHistory;


const mongooseOptions = configs.db.mongooseHistoryOptions;
const connetionHandlerConfig = {
  dbConnectionPath: configs.db.dbConnectionHistoryPath,
  mongooseOptions: mongooseOptions ,
  dbName: configs.db.dbHistoryName,
};
connection = connectionHandler(configs.db.dbConnectionHistoryPath, mongooseOptions , connetionHandlerConfig);
/**
 * Add the models here
 */
gameReportHistory = gameReportHistoryModel(mongoose, connection);
playerBetHistory = playerBetHistoryModel(mongoose, connection);


export default { connection, gameReportHistory, playerBetHistory };

