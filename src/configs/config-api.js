import savvyDomainHelper from 'savvy_domainhelper';
import _configMain from './config-main';
const obj = {};

const env = savvyDomainHelper.get_env(); // application environment (LCL = LOCAL ; LAB = LAB ; UAT = UAT ; PRD = PRODUCTION)
const domainPostfix = savvyDomainHelper.get_domainPostfix(); // domain postfix depends on TZ or BG
let apiPort = 2140
let apiAddress = '';

if (env === 'LAB') { // LAB
  apiAddress = `sample.lab${domainPostfix}`; // API address
} else if (env === 'UAT') { // UAT
  apiAddress = `sample.uat${domainPostfix}`; // API address
} else if (env === 'PRD') { // PRD
  apiAddress = `sample.prd${domainPostfix}`; // API address
} else { // LOCAL (DEFAULT)
  apiAddress = savvyDomainHelper.get_localIp(); // API address
}

obj.roundPrefix = '00001'; // Initialize Prefix Round ID RSP for Report
obj.gameIdFromOnyx = 1; // Initialize Game ID RPS from Onyx
obj.targetServer = `http://${apiAddress}:${apiPort}/`;


obj.availableBalanceAPI = 'availableBalanceAPI';
obj.botLoginAPI = 'botLoginAPI';
obj.loginAPI = 'loginAPI';
obj.psAvatarAPI = 'psAvatarAPI';
obj.reserveBalanceAPI = 'reserveBalanceAPI';
obj.resultBetAPI = 'resultBetAPI';
obj.returnBalanceAPI = 'returnBalanceAPI';
obj.rngAPI = 'rngAPI';
obj.sellBetAPI = 'sellBetAPI';
obj.subSellBetAPI = 'subSellBetAPI';
obj.checkBetAPI = 'extractBetAPI';
obj.cancelBetAPI = 'cancelBetAPI';

export default obj;
