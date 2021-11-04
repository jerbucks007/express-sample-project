import configs from '../../configs';
import models from '../../models';

/**
 * @class RouteChanger
 * @description This class is for the changing of routes
 */
export default class RouteChanger {
  /**
	 * @constructor The constructor of the RouteChanger
	 * @param null
	 */
  constructor() {
    this.siteMapping = [{
      id: 0,
      name: '338A',
      parent: '338A',
      path: '',
    },
    {
      id: 1,
      name: 'Gobetx',
      parent: '338A',
      path: '_gobetx/',

    },
    {
      id: 2,
      name: 'GoSDSB',
      parent: '338A',
      path: '_gosdsb/',
    },
    {
      id: 3,
      name: 'GobandarQ',
      parent: '338A',
      path: '_gobandarq/',
    },
    {
      id: 4,
      name: 'PusatJudi',
      parent: '338A',
      path: '_pusatjudi/',
    },
    {
      id: 5,
      name: 'PastiMenangBet',
      parent: '338A',
      path: '_pastimenangbet/',
    },
    {
      id: 6,
      name: 'SBO',
      parent: 'SBO',
      path: '_sbo/',
    },
    {
      id: 7,
      name: 'BinBinCash',
      parent: '338A',
      path: '_binbincash/',
    },
    ];

    this.main = {
      desktopJade: 'desktop/main',
      mobileJade: 'mobile/main',
    };

    this.history = {
      desktopJade: 'history',
      mobileJade: 'history',
    };
  }

  /** 
	 * @function getRoute
	 * @description get the correct view based on passed parameter
	 * @param {String} the view type
	 * @param {Number} site type/id
	 * @param {Boolean} true if mobile, false if desktop
	 * @return {String} view name
	 */
  getRoute(viewType, siteType, isMobile) {
    const routeObj = (siteType >= 0) ? this[viewType] : null;
    let viewName = '404';
    if (routeObj) {
      viewName = this.siteMapping[siteType].path;
      viewName += (isMobile === true) ? routeObj.mobileJade : routeObj.desktopJade;
    }
    return viewName;
  }

  /** 
	 * @function getID
	 * @description get the site type/id based on host name
	 * @param {String} host name
	 * @param {Function} callback function
	 * @return {Number} site type/id
	 */
  async getID(hostName) {
    const param = (hostName) ? hostName.toLowerCase() : '';
    const fullHostName = param.split('.');
    const host = (fullHostName[fullHostName.length - 2]) ? fullHostName[fullHostName.length - 2] : null;
    return await this.findSiteType(host);

    /** Uncomment for SBO callback */
    // callback(6); 
  }

  /** 
	 * @function findSiteType
	 * @description find the site type/id based on host name
	 * @param {String} host name
	 * @param {Function} callback function
	 * @return {Number} the site type/id, -1 if not found
	 */
  async findSiteType(host) {
    const domain = await models.centralpoint.domains.findOne({ site: host }).lean();
    // .slaveOk().read('secondaryPreferred');
    if (!domain) return null;
    return domain.type;
  }

  /** 
	 * @function getPlatform
	 * @description get platform object based on site type/id
	 * @param {Number} site type/id
	 * @return {Object} platform object
	 */
  getPlatform(id) {
    let platform = {
      id: -1,
      name: 'SAVVY',
      parent: 'N/A',
      path: '',
    };
    for (let i = 0; i < this.siteMapping.length; i++) {
      if (this.siteMapping[i].id === id) {
        platform = this.siteMapping[i];
        break;
      }
    }

    return platform;
  }

  /** 
	 * @function mobileDomainChecker (338A)
	 * @description check if the view will be mobile or desktop (by referrer)
	 * @param {String} referrer name
	 * @return {Boolean} true if its mobile view, false if desktop view
	 */
  mobileDomainChecker(refName) {
    let result = false;

    const param = (refName) ? refName.toLowerCase() : '';
    const fullHostName = param.split('.');
    const prefixdata = (fullHostName[0]) ? fullHostName[0].split('/') : '';
    const prefix = (prefixdata[prefixdata.length - 1]) ? prefixdata[prefixdata.length - 1] : null;

    const prefixList = ['m'];

    for (let i = 0; i < prefixList.length; i++) {
      const keyword = prefixList[i];
      if (keyword === prefix) {
        result = true;
        break;
      }
    }

    //	result = false; //set only if mobile not yet ready
    if (configs.main.isTest) {
      result = false; // set it as needed for local
    }

    return result;
  }
}
