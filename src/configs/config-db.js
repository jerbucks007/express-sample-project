import savvyDomainHelper from 'savvy_domainhelper';
import _configMain from './config-main';

const obj = {};

// Application environment (LCL = LOCAL ; LAB_LCL = LOCAL LAB; LAB = LAB ; UAT = UAT ; PRD = PRODUCTION)
const env = savvyDomainHelper.get_env();
const house = _configMain.getHouse();
const domainPostfix = savvyDomainHelper.get_domainPostfix();

// Mongoose options
obj.mongooseOptions = {
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 10,
  useUnifiedTopology: true,
  user: env === 'LCL' ? '' : 'username',
  pass: env === 'LCL' ? '' : 'p@sSw0rD',
};

// Mongoose History Option
obj.mongooseHistoryOptions = {
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 10,
  useUnifiedTopology: true,
  user: env === 'LCL' ? '' : 'username',
  pass: env === 'LCL' ? '' : 'p@sSw0rD',
};


if (env === 'LAB') {

  obj.dbName = 'sampleDB'; // db name
  obj.dbHistoryName = 'sampleHDB'; // db history name
  obj.dbCentralPoint = 'sampleCDB'; // db shared name

  const dbPort = ':27017'; // db port
  const dbaddr1 = `sample.lab${domainPostfix}${dbPort}`; // db 1 address
  const shdbaddr1 = `sample.lab.history${domainPostfix}${dbPort}`; // history address

  obj.dbConnectionPath = `mongodb://${dbaddr1}/${obj.dbName}`; // db connection path
  obj.dbConnectionSharePath = `mongodb://${dbaddr1}/${obj.dbCentralPoint}`; // shared db connection path
  obj.dbConnectionHistoryPath = `mongodb://${dbaddr1}/${obj.dbHistoryName}`; // history db connection path

} else if (env === 'UAT') {

  obj.dbName = 'sampleDB'; // db name
  obj.dbHistoryName = 'sampleHDB'; // db history name
  obj.dbCentralPoint = 'sampleCDB'; // db shared name

  const dbPort = ':27017'; // db port
  const dbaddr1 = `sample.uat${domainPostfix}${dbPort}` ; // db 1 address
  const dbaddr2 = `sample.uat2${domainPostfix}${dbPort}` ; // db 2 address
  const dbaddrshared1 = `sample.uat.central${domainPostfix}${dbPort}`;
  const dbaddrshared2 = `sample.uat2.central${domainPostfix}${dbPort}`;
  const shdbaddr1 = `sample.uat.history${domainPostfix}${dbPort}`; // history address

  obj.dbConnectionPath = `mongodb://${dbaddr1},${dbaddr2}/${obj.dbName}`; // db connection path
  obj.dbConnectionSharePath = `mongodb://${dbaddrshared1},${dbaddrshared2}/${obj.dbCentralPoint}`; // shared db connection path
  obj.dbConnectionHistoryPath = `mongodb://${shdbaddr1}/${obj.dbHistoryName}`; // history db connection path

  obj.mongooseOptions.replicaSet = 'replicaSet';

} else if (env === 'PRD') {

  obj.dbName = 'sampleDB'; // db name
  obj.dbHistoryName = 'sampleHDB'; // db history name
  obj.dbCentralPoint = 'sampleCDB'; // db shared name

  const dbPort = ':27017'; // db port
  const dbaddr1 = `sample.prd${domainPostfix}${dbPort}` ; // db 1 address
  const dbaddr2 = `sample.prd2${domainPostfix}${dbPort}` ; // db 2 address
  const dbaddrshared1 = `sample.prd.central${domainPostfix}${dbPort}`;
  const dbaddrshared2 = `sample.prd2.central${domainPostfix}${dbPort}`;
  const shdbaddr1 = `sample.uat.history${domainPostfix}${dbPort}`; // history address

  obj.dbConnectionPath = `mongodb://${dbaddr1},${dbaddr2}/${obj.dbName}`; // db connection path
  obj.dbConnectionSharePath = `mongodb://${dbaddrshared1},${dbaddrshared2}/${obj.dbCentralPoint}`; // shared db connection path
  obj.dbConnectionHistoryPath = `mongodb://${shdbaddr1}/${obj.dbHistoryName}`; // history db connection path

  obj.mongooseOptions.replicaSet = 'replicaSet';

} else {

  obj.dbName = 'sampleDB'; // db name
  obj.dbHistoryName = 'sampleHDB'; // db history name
  obj.dbCentralPoint = 'sampleCDB'; // db shared name

  const dbPort = ':27017'; // db port
  const dbaddr1 = `localhost${dbPort}`; // db 1 address
  const shdbaddr1 = `localhost${dbPort}`; // history address

  obj.dbConnectionPath = `mongodb://${dbaddr1}/${obj.dbName}`; // db connection path
  obj.dbConnectionSharePath = `mongodb://${dbaddr1}/${obj.dbCentralPoint}`; // shared db connection path
  obj.dbConnectionHistoryPath = `mongodb://${shdbaddr1}/${obj.dbHistoryName}`; // history db connection path

}
export default obj;
