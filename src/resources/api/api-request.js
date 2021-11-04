import request from 'request';
import configs from '../../configs';
import logger from '../functions/function-log';

export default async (apiName, callFrom, paramAPI) => {
  try {
    const options = {
      url: configs.api.targetServer + apiName,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      strictSSL: false,
      rejectUnauthorized: false,
      form: {
        paramAPI: JSON.stringify(paramAPI),
        callFrom,
      },
    };

    const standardErrorResponse = {
      // define this based on the standard API response from external
      failed: true,
      error: {
        title: 'Request API ERROR',
        message: 'Sorry, there is an error. Please try again later, or contact our customer support.',
        messageIndonesian: '',
        isClosed: 1,
      },
      clients: null,
      callFrom,
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        let result = null;
        if ((body !== null) && (body !== undefined)) {
          let errorCatch = false;
          try {
            result = JSON.parse(body);
          } catch (e) {
            logger.ERROR({ msg: 'error when parsing response body', options, response, body, error }, '### [ERROR] REQUEST ###', 'api-request.js');
            errorCatch = true;
            return resolve(standardErrorResponse);
          }
          if (!errorCatch) {
            if (result.errorAPI === undefined || result.errorAPI === null) {
              return resolve(result);
            }
            standardErrorResponse.error = result.error;
            standardErrorResponse.clients = result.clients || null;

            return resolve(standardErrorResponse);
          }
        } else {
          logger.ERROR({ msg: 'response body null/undefined', options, response, body, error }, '[REQUEST API] method error', 'api-request.js');
          return resolve(error);
        }
      });
    });
  } catch (error) {
    logger.ERROR({ msg: 'try catch error', error }, '[REQUEST API] method error', 'api-request.js');
  }
};
