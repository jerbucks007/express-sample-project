import * as _variable from './general-variable';
/**
 * @function doSetIp
 * @description make sure the IP is only 1 in case got array of IP
 * @param {String/[String]} IP address(es), this can be string or array
 * @return {String} the result IP
 */
export const doSetIp = (address) => {
  let ip = address;
  if (!_variable.isNotEmpty(ip)) ip = 'empty IP';
  else if (_variable.isArray(ip)) ip = address[0];

  if (ip.toString().indexOf(',') > -1) ip = ip.toString().substring(0, ip.toString().indexOf(','));

  return ip;
};

/**
 * @function subnetChecker
 * @description make sure the IP is still in 1 subnet, in case the IP changed
 * @param {String} session IP
 * @param {String} header IP
 * @return {Boolean} true if still in 1 subnet, false if not
 */
export const subnetChecker = (sessionIp, headerIp) => {
  const splitSessionIp = sessionIp.split('.');
  const splitHeaderIp = headerIp.split('.');
  if (splitSessionIp[0] === splitHeaderIp[0] && splitSessionIp[1] === splitHeaderIp[1] && splitSessionIp[2] === splitHeaderIp[2]) {
    if (Number(splitSessionIp[3]) > 255 || Number(splitHeaderIp[3]) > 255) {
      return false;
    }
    return true;
  }
  return false;
};
