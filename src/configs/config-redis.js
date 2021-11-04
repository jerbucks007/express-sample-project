import savvyDomainHelper from 'savvy_domainhelper';

const obj = {};

const domainPostfix = savvyDomainHelper.get_domainPostfix(); // domain postfix depends on TZ or BG
const env = savvyDomainHelper.get_env(); // application environment (LCL = LOCAL ; LAB = LAB ; UAT = UAT ; PRD = PRODUCTION)

obj.port = 6379; // redis port
obj.ENV = env; // redis env

if (env === 'LAB') { // LAB

  obj.url = `sample.lab${domainPostfix}`; // redis address

} else if (env === 'UAT') { // UAT

  obj.url = `sample.uat${domainPostfix}`; // redis address

} else if (env === 'PRD') { // PRD

  obj.url = `sample.prd${domainPostfix}`; // redis address

} else { // LOCAL (DEFAULT)

  obj.url = `localhost${domainPostfix}`; // redis address
  obj.ENV = 'LCL'; // redis env
  
}

export default obj;
