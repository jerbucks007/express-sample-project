import redisHandler from './redis-handler';
import configs from '../configs';
import functions, { logger } from '../resources/functions';

export const channel = `DtmGameChannel_${configs.redis.ENV}`;
export const redis = redisHandler(configs.redis.port, configs.redis.url, channel);

export const listen = async ({ io }) => {
  redis.subscriber.on('message', async (ch, message) => {
    try {
      logger.NOTICE(`Message: ${message} on channel: ${ch} is arrive!`, '[REDIS] [NEW MESSAGE]', 'src/redis/redis-game.js');
      const content = JSON.parse(message);
      if (!content || !content.pubObjectName || !content.username || !content.clientId || !content.roomId) return;

      switch (content.pubObjectName) {
        case 'API-TERMINATE-SINGLE': {
          const user = await functions.db.activeUsers.find({ username: content.username, clientId: content.clientId }, '_id clientId username');
          if (user && user._id) {
            const condition = { tableId: content.roomId, refActiveUser: user._id };
            await functions.db.playerSessions.update(condition, { state: 2 }, true);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      logger.ERROR({ msg: 'Error catch in redis-game', error }, '[REDIS] [GAME]', 'src/redis/redis-game.js');
    }
  });
};
