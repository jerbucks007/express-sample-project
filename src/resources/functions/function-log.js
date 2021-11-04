/**
 * 
 * @Contributor: Jerard Joseph Buencamino
 * @Company: Leekie Enterprises
 * @2019
 * @FilePath: resources/functions/function-log.js
 * @Version: 1.0.0
 * @Created: Thursday, 7 February 2019
 * @Changes: -
 * @desc function for creating logs
 * 
 */
import Log from 'log';
import Fs from 'node-fs';
import chalk from 'chalk';

import configs from '../../configs';

if (!Fs.existsSync(configs.main.logsFolder)) {
  Fs.mkdirSync(configs.main.logsFolder);
}

const log = new Log('info', Fs.createWriteStream(configs.main.pathToLog, { flags: 'a' }));

const red = chalk.keyword('red');
const cyan = chalk.keyword('cyan');
const yellow = chalk.keyword('yellow');
const green = chalk.keyword('green');
const orange = chalk.keyword('orange');

/** LOG STATE DESCRIPTION
 * EMERGENCY = system is unusable
 * ALERT = action must be taken immediately
 * CRITICAL = the system is in critical condition
 * ERROR = error condition
 * WARNING = warning condition
 * NOTICE = a normal but significant condition
 * INFO = a purely informational message
 * DEBUG = messages to debug an application
 * 
 */

/**
 * example of how to use
 * 
 * var functionLog= require('savvy_log');
 * functionLog.EMERGENCY({user: 'testlogging'}, "logging test", "function-log.js");
 * functionLog.ALERT({user: 'testlogging'}, "logging test", "function-log.js");
 * functionLog.CRITICAL({user: 'testlogging'}, "logging test", "function-log.js");
 * functionLog.ERROR({user: 'testlogging'}, "logging test", "function-log.js");
 * functionLog.WARNING({user: 'testlogging'}, "logging test", "function-log.js");
 * functionLog.NOTICE({user: 'testlogging'}, "logging test", "function-log.js");
 * functionLog.INFO({user: 'testlogging'}, "logging test", "function-log.js");
 * functionLog.DEBUG({user: 'testlogging'}, "logging test", "function-log.js");
 * 
 */

/**
 * @function EMERGENCY
 * @description create EMERGENCY log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const EMERGENCY = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(red(`[${new Date()}] EMERGENCY => ${JSON.stringify(logObject)}`));
      log.emergency(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

/**
 * @function ALERT
 * @description create ALERT log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const ALERT = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(yellow(`[${new Date()}] ALERT => ${JSON.stringify(logObject)}`));
      log.alert(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

/**
 * @function CRITICAL
 * @description create CRITICAL log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const CRITICAL = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(red(`[${new Date()}] CRITICAL => ${JSON.stringify(logObject)}`));
      log.critical(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

/**
 * @function ERROR
 * @description create ERROR log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const ERROR = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(red(`[${new Date()}] ERROR => ${JSON.stringify(logObject)}`));
      log.error(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

/**
 * @function WARNING
 * @description create WARNING log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const WARNING = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(orange(`[${new Date()}] WARNING => ${JSON.stringify(logObject)}`));
      log.warning(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

/**
 * @function NOTICE
 * @description create NOTICE log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const NOTICE = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(yellow(`[${new Date()}] NOTICE => ${JSON.stringify(logObject)}`));
      log.notice(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

/**
 * @function INFO
 * @description create INFO log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const INFO = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(green(`[${new Date()}] INFO => ${JSON.stringify(logObject)}`));
      log.info(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

/**
 * @function DEBUG
 * @description create DEBUG log
 * @param {object} content content of the log (required)
 * @param {String} title title of the log, for easier searching (can be empty)
 * @param {String} filename file name that use the logging, for easier searching (can be empty)
 */
const DEBUG = (content, title, filename) => {
  try {
    if (content) {
      const logObject = {
        title: (title) || '-',
        content,
        filename: (filename) || '-',
        server: 'TABLE',
      };
      console.log(cyan(`[${new Date()}] DEBUG => ${JSON.stringify(logObject)}`));
      log.debug(`=> ${JSON.stringify(logObject)}`);
    } // content is required 
  } catch (error) {
    log.error({ error }, 'TRY CATCH ERROR IN EMERGENCY LOGGING', 'savvy_log');
  }
};

export default { INFO, DEBUG, WARNING, ERROR, NOTICE, CRITICAL, ALERT, EMERGENCY };
