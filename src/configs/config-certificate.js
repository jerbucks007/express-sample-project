import fs from 'node-fs';
import path from 'path';
import savvyDomainHelper from 'savvy_domainhelper';
import tls from 'tls';

const obj = {};

const env = savvyDomainHelper.get_env(); // application environment (LCL = LOCAL ; LAB = LAB ; UAT = UAT ; PRD = PRODUCTION)
const useInternalCert = !!((env !== 'UAT' && env !== 'PRD')); // true if cert provided by app, false if provided by network
const pathToCertificate = path.resolve(__dirname, '../../data/certificate'); // certificate path, don't change it
// let pathToCertificate = `${savvyRoot.get_rootpath()}/data/certificate`; // certificate path, don't change it
if (useInternalCert) {
  const certificates = {
    '338alab': {
      key: fs.readFileSync(`${pathToCertificate}/ssl.key/338alab.com.pem`),
      cert: fs.readFileSync(`${pathToCertificate}/ssl.crt/338alab.com.cer`),
    },
    gobetxlab: {
      key: fs.readFileSync(`${pathToCertificate}/ssl.key/gobetxlab.pem`),
      cert: fs.readFileSync(`${pathToCertificate}/ssl.crt/gobetxlab.cer`),
    },
    gosdsblab: {
      key: fs.readFileSync(`${pathToCertificate}/ssl.key/gosdsblab.pem`),
      cert: fs.readFileSync(`${pathToCertificate}/ssl.crt/gosdsblab.cer`),
    },
    gobandarqlab: {
      key: fs.readFileSync(`${pathToCertificate}/ssl.key/gobandarqlab.pem`),
      cert: fs.readFileSync(`${pathToCertificate}/ssl.crt/gobandarqlab.cer`),
    },
    binbincashlab: {
      key: fs.readFileSync(`${pathToCertificate}/ssl.key/binbincashlab.pem`),
      cert: fs.readFileSync(`${pathToCertificate}/ssl.crt/binbincashlab.cer`),
    },
  };
  obj.certOptions = {
    SNICallback(domain, callback) {
      const target = (domain) || 'www.338alab.com';
      const splitTarget = target.split('.');
      const index = (splitTarget.length > 2) ? 1 : 0;
      const targetDomain = splitTarget[index];
      const targetCert = (certificates[targetDomain]) ? certificates[targetDomain] : certificates['338alab'];
      const cert = tls.createSecureContext(targetCert);
      if (callback) {
        callback(null, cert);
      } else {
        return cert;
      }
    },
    key: fs.readFileSync(`${pathToCertificate}/ssl.key/selfsign.pem`),
    cert: fs.readFileSync(`${pathToCertificate}/ssl.crt/selfsign.crt`),
  };
} else {
  obj.certOptions = {
    key: fs.readFileSync(`${pathToCertificate}/ssl.key/selfsign.pem`),
    cert: fs.readFileSync(`${pathToCertificate}/ssl.crt/selfsign.crt`),
    ca: [
      fs.readFileSync(`${pathToCertificate}/ssl.crt/AddTrustExternalCARoot.crt`),
      fs.readFileSync(`${pathToCertificate}/ssl.crt/COMODORSAAddTrustCA.crt`),
      fs.readFileSync(`${pathToCertificate}/ssl.crt/COMODORSADomainValidationSecureServerCA.crt`),
    ],
  };
}

export default obj;
