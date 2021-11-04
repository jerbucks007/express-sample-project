import savvyDomainHelper from 'savvy_domainhelper';
import savvyRoot from 'savvy_root';

const obj = {};
// application environment (LCL = LOCAL ; LAB_LCL = LOCAL LAB; LAB = LAB ; UAT = UAT ; PRD = PRODUCTION)
const env = savvyDomainHelper.get_env();

if (env === 'LAB') {

  // PORT AND ADDRESS
  obj.port = 9999; // port
  obj.ipAddress = savvyDomainHelper.get_localIp(); // application address
  obj.isHttp = true; // true or false
  obj.protocol = 'https'; // protocol that will be used in the app, http or https;

  // PATH
  obj.pathToServer = savvyRoot.get_rootpath(); // path to access the server
  obj.rsPrefix = 'rs.'; // resource server prefix
  obj.rsPostfix = '/game/table'; // resource server postfix
  obj.arsPrefix = 'rso.'; // avatar resource server prefix
  obj.pathToPhp = null;
  obj.intENV = 1;

} else if (env === 'UAT') {

  // console.log = function () { }; // disable console log

  // PORT AND ADDRESS
  obj.port = 9999; // port
  obj.ipAddress = savvyDomainHelper.get_localIp(); // application address
  obj.isHttp = true; // true or false
  obj.protocol = 'https'; // protocol that will be used in the app, http or https;

  // PATH
  obj.pathToServer = savvyRoot.get_rootpath(); // path to access the server
  obj.rsPrefix = 'rs.'; // resource server prefix
  obj.rsPostfix = '/game/table'; // resource server postfix
  obj.arsPrefix = 'rso.'; // avatar resource server prefix
  obj.pathToPhp = null;
  obj.intENV = 2;

} else if (env === 'PRD') {

  console.log = function () { }; // disable console log

  // PORT AND ADRESS
  obj.port = 9999; // port
  obj.ipAddress = savvyDomainHelper.get_localIp(); // application address
  obj.isHttp = true; // true or false
  obj.protocol = 'https'; // protocol that will be used in the app, http or https;

  // PATH
  obj.pathToServer = savvyRoot.get_rootpath(); // path to access the server
  obj.rsPrefix = 'rs.'; // resource server prefix
  obj.rsPostfix = '/game/table'; // resource server postfix
  obj.arsPrefix = 'rso.'; // avatar resource server prefix
  obj.pathToPhp = null;
  obj.intENV = 3;

} else {

  // PORT AND ADRESS
  obj.port = 9999; // port
  obj.ipAddress = savvyDomainHelper.get_localIp(); // application address
  obj.isHttp = true; // true or false
  obj.protocol = 'http'; // protocol that will be used in the app, http or https;

  // PATH
  obj.pathToServer = savvyRoot.get_rootpath(); // path to access the server
  obj.rsPrefix = 'rs.'; // resource server prefix
  obj.rsPostfix = '/game'; // resource server postfix
  obj.arsPrefix = 'rso.'; // avatar resource server prefix
  obj.pathToPhp = 'C:/xampp/php/php.exe';
  obj.intENV = 1;
  
}

// MISC
obj.ENV = env;
obj.HOST = savvyDomainHelper.get_host();
obj.serverId = savvyDomainHelper.get_serverId(); // server ID (numbering)
obj.domainPostfix = savvyDomainHelper.get_domainPostfix();
obj.isTest = (env === 'LCL');
obj.appName = 'Sample Game'; // application name
obj.encrypterSecret = 'S3cR3T'; // secret for encrypter
obj.saltSettings = 'game'; // for mongostore encryption
obj.appUnique = `_game${env}`; // unique to avoid conflict with others (members or env or app)
obj.appVersion = '1.8';
obj.certificationGameId = 1;

obj.maxPlayerPerTable = 50;
obj.gTag = obj.serverId === 1 ? 'G-GVYZGWHNTS' : 'G-0ZX03NT9F3' //google analytics tag

// COOKIE AND SESSION
obj.EXPRESS_SID_KEY = `_gameid_${env}`; // express sid
obj.COOKIE_SECRET = `$3creT_${env}`; // cookie secret

// PATH TO LOG
obj.logsFolder = `${savvyRoot.get_logpath()}/log/game`;
obj.pathToLog = `${savvyRoot.get_logpath()}/log/game/game-console.log`; // path to log if you don't have log path yet

export default obj;
