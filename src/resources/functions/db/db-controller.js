import logger from '../function-log';

export default (model, collectioName) => {
  const fn = {};
  /**
   * @function save
   * @description This will save new document in the DB.
   * @param {Object} newDocumentObj An object that contains user data to be saved.
   * @returns This return an {Object} if successfully execute, null if not
   */
  fn.save = async (newDocumentObj) => {
    const newUser = new model(newDocumentObj);
    return await newUser.save().catch(errMsg => {
      logger.ERROR({ errMsg, newDocumentObj }, `${collectioName} save method`, 'db-controller.js');
      return null;
    });
  };

  /**
   * @function find
   * @description This will find the existing document in the DB.
   * @param {Object} condition An object that contains queries
   * @param {String} select This will include the specific filed in the document
   * @param {Boolean} isMulti Checker if finding of collection is many or single
   * @returns This return an {Object} if successfully execute, null if not
   */
  fn.find = async (condition, select, isMulti) => {
    if (isMulti) {
      return await model.find(condition).select(select)
        .lean()
        .slaveOk()
        .read('secondaryPreferred')
        .catch(errMsg => {
          logger.ERROR({ errMsg, condition, isMulti }, `${collectioName} find multi method`, 'db-controller.js');
          return null;
        });
    }

    // Execute when isMulti -> false
    return await model.findOne(condition).select(select).lean()
      .slaveOk()
      .read('secondaryPreferred')
      .catch(errMsg => {
        logger.ERROR({ errMsg, condition, isMulti }, `${collectioName} find multi method`, 'db-controller.js');
        return null;
      });
  };

  /**
   * @function update
   * @description This will update the document in the DB
   * @param {Object} condition An object that contains queries
   * @param {Object} param An object that contains updated information
   * @param {Boolean} isMulti Checker if updating of collection is many or single
   * @returns This return an {Object} if successfully execute, null if not
   */
  fn.update = async (condition, param, isMulti) => {
    if (isMulti) {
      return await model.updateMany(condition, { $set: param }).catch(errMsg => {
        logger.ERROR({ errMsg, condition, param, isMulti }, `${collectioName} update multi method`, 'db-controller.js');
        return null;
      });
    }

    // Execute when isMulti -> false
    return await model.findOneAndUpdate(condition, { $set: param }, { new: true }).catch(errMsg => {
      logger.ERROR({ errMsg, condition, param, isMulti }, `${collectioName} update single method`, 'db-controller.js');
      return null;
    });
  };

  /**
   * @function remove
   * @description This will remove the document in the DB
   * @param {Object} condition An object that contains query
   * @param {Boolean} isMulti Checker if deleting of collection is many or single
   * @returns This return an {Object} if successfully execute, null if not
   */
  fn.remove = async (condition, isMulti) => {
    if (isMulti) {
      return model.deleteMany(condition).catch(errMsg => {
        logger.ERROR({ condition, errMsg, isMulti }, `${collectioName} delete multi method`, 'db-controller.js');
        return null;
      });
    }

    // Execute when isMulti -> false
    return model.deleteOne(condition).catch(errMsg => {
      logger.ERROR({ errMsg, condition, isMulti }, `${collectioName} delete single method`, 'db-controller.js');
      return null;
    });
  };

  /**
   * @function findAndUpdate
   * @description This will increment the object
   * @param {Object} condition An object that contains queries
   * @param {Object} param An object contains what to data to increment
   * @returns This return an updated {Object} if successfully execute, null if not
   */
  fn.increment = async (condition, param) => await model.findOneAndUpdate(condition, param, { new: true }).catch(errMsg => {
    logger.ERROR({ errMsg, condition, param }, `${collectioName} increment method`, 'db-controller.js');
    return null;
  });

  /**
   * @function count
   * @description This will count all the document.
   * @returns Returns the a number which is the total documents
   */
  fn.count = async (condition) => await model.countDocuments(condition).catch(errMsg => {
    logger.ERROR({ errMsg, condition }, `${collectioName} count method`, 'db-controller.js');
    return null;
  });

  /**
   * @function bulkWrite
   * @description Updating multiple documents with different values 
   * @returns Returns an object 
   */

  fn.bulkWrite = async (data) => await model.bulkWrite(data).catch(errMsg => {
    logger.ERROR({ errMsg, data }, `${collectioName} bulkWrite method`, 'db-controller.js');
    return null;
  });

  /**
   * @function insert
   * @description This will insert new document in the DB.
   * @param {Array} collections An object that contains user data to be insert.
   * @returns This return an {Object} if successfully execute, null if not
   */
  fn.insert = async (collections) => await model.collection.insert(collections).catch(errMsg => {
    logger.ERROR({ errMsg, collections }, `${collectioName} save method`, 'db-controller.js');
    return null;
  });

  return fn;
};

