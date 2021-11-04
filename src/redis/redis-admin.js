import mongoose from 'mongoose';
import redisHandler from './redis-handler';
import configs from '../configs';
import functions, { logger } from '../resources/functions';

export const channel = `DtmAdminChannel_${configs.redis.ENV}`;
export const redis = redisHandler(configs.redis.port, configs.redis.url, channel);

export const listen = async ({ io }) => {
  redis.subscriber.on('message', async (ch, message) => {
    try {
      logger.NOTICE(`Message: ${message} on channel: ${ch} is arrive!`, '[REDIS] [NEW MESSAGE]', 'src/redis/redis-admin.js');
      const msg = JSON.parse(message);
      const content = JSON.parse(msg.content);

      switch (content.message) {
        /**
         *  TABLE
         */
        case 'ADMIN-TABLE-UPDATE': {
          const tableId = content.uniqueTableId;

          const table = await functions.db.tables.find({ uniqueTableId: tableId, serverId: configs.main.serverId });
          if (table) {
            // table is active
            if (content.status === 'true' || content.status === true) {
              global.TABLECONTROLLER.updateTable(tableId, table);
              const tableObj = global.TABLECONTROLLER.getTable(tableId);
              if (table.status === true && table.state === 2) functions.game.startGame({ io, tableObj });
            } else {
              // Update the table state into 2
              global.TABLECONTROLLER.updateTable(tableId, { status: false });
              io.to(tableId).emit('broadcast announcement', { txt: 'This table will be closed after this game, thank you.', time: 30 * 1000 });
            }
          }

          break;
        }
        case 'ADMIN-TABLE-ADD': {
          const tableId = content.uniqueTableId;
          const table = await functions.db.tables.find({ uniqueTableId: tableId, serverId: configs.main.serverId });
          if (table) {
            global.TABLECONTROLLER.addTable(table);
          }
          break;
        }
        case 'ADMIN-TABLE-REMOVE': {
          const tableId = content.uniqueTableId;
          global.TABLECONTROLLER.removeTable(tableId);
          break;
        }
        /**
         * LIMIT
         */
        case 'ADMIN-LIMIT-UPDATE': {
          // const state = content.status === 'false' ? 1 : 0;
          // const field = content.currency.toUpperCase() === 'BASE' ? 'tableLimit.baseId' : 'tableLimit._id';
          // const query = {};
          // query[field] = mongoose.Types.ObjectId(content.id);
          // await functions.db.playerSessions.update(query, { state }, true);
          //io.emit('update table limit');
          break;
        }
        default:
          break;
      }
    } catch (error) {
      logger.ERROR({ msg: 'Error catch in redis-admin', error }, '[REDIS] [ADMIN]', 'src/redis/redis-admin.js');
    }
    /**
     * Your code here!
     */
  });
};
