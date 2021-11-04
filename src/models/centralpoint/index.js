import mongoose from 'mongoose';
import connectionHandler from '../connection-handler';
import configs from '../../configs';

// MODELS
import userModel from './model-users';
import domainModel from './model-domains';
import svyCounterModel from './model-svy-counters';
import userLivecasinosModel from './model-user-livecasinos';
// import { compilation } from 'webpack';

let mongooseOptions = Object.assign({} , configs.db.mongooseOptions);
if (configs.main.ENV === 'UAT' || configs.main.ENV === 'PRD') { 
  mongooseOptions.replicaSet = 'savvy';
  mongooseOptions.pass = 'Im@g1n@t10n';
}

const connetionHandlerConfig = {
  dbConnectionPath: configs.db.dbConnectionSharePath,
  mongooseOptions: mongooseOptions,
  dbName: configs.db.dbCentralPoint,
};
const connection = connectionHandler(configs.db.dbConnectionSharePath, mongooseOptions , connetionHandlerConfig);
/**
 * Add the models here
 */
const users = userModel(mongoose, connection);
const domains = domainModel(mongoose, connection);
const svyCoutners = svyCounterModel(mongoose, connection);
const userLivecasinos = userLivecasinosModel(mongoose , connection)

export default { connection, users, domains, svyCoutners , userLivecasinos};
