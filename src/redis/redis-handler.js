import redis from 'redis';
import { logger } from '../resources/functions';

export default (port, url, channel) => {
  const obj = {};
  const publisher = redis.createClient(port, url);
  const subscriber = redis.createClient(port, url);
  subscriber.subscribe(channel);

  publisher.on('connect', () => {
    logger.DEBUG({ url, port, channel }, '[REDIS] [PUBLISHER] [CONNECT]', 'src/redis/redis-handler.js');
  });
  subscriber.on('connect', () => {
    logger.DEBUG({ url, port, channel }, '[REDIS] [SUBSCRIBER] [CONNECT]', 'src/redis/redis-handler.js');
  });

  publisher.on('ready', () => {
    logger.DEBUG({ url, port, channel }, '[REDIS] [PUBLISHER] [READY]', 'src/redis/redis-handler.js');
  });
  subscriber.on('ready', () => {
    logger.DEBUG({ url, port, channel }, '[REDIS] [SUBSCRIBER] [READY]', 'src/redis/redis-handler.js');
  });

  publisher.on('reconnecting', () => {
    logger.DEBUG({ url, port, channel }, '[REDIS] [PUBLISHER] [RECONNECTING]', 'src/redis/redis-handler.js');
  });
  subscriber.on('reconnecting', () => {
    logger.DEBUG({ url, port, channel }, '[REDIS] [SUBSCRIBER] [RECONNECTING]', 'src/redis/redis-handler.js');
  });

  publisher.on('error', (errPub) => {
    logger.ERROR({ url, port, channel, err: errPub }, '[REDIS] [PUBLISHER] [ERROR]', 'src/redis/redis-handler.js');
  });
  subscriber.on('error', (errSub) => {
    logger.ERROR({ url, port, channel, err: errSub }, '[REDIS] [SUBSCRIBER] [ERROR]', 'src/redis/redis-handler.js');
  });

  publisher.on('end', () => {
    logger.ERROR({ url, port, channel }, '[REDIS] [PUBLISHER] [END]', 'src/redis/redis-handler.js');
  });
  subscriber.on('end', () => {
    logger.ERROR({ url, port, channel }, '[REDIS] [SUBSCRIBER] [END]', 'src/redis/redis-handler.js');
  });

  process.on('exit', () => {
    logger.ERROR({ error: 'process exit', url, port, channel }, 'publisher and subscriber quit', 'src/redis/redis-handler.js');
    publisher.quit();
    subscriber.quit();
  });
  process.on('SIGINT', () => {
    logger.ERROR({ error: 'process SIGINT', url, port, channel }, 'publisher and subscriber quit', 'src/redis/redis-handler.js');
    publisher.quit();
    subscriber.quit();
  });
  process.on('SIGUSR2', () => {
    logger.ERROR({ error: 'process SIGUSR2', url, port, channel }, 'publisher and subscriber quit', 'src/redis/redis-handler.js');
    publisher.quit();
    subscriber.quit();
  });
  process.on('SIGTERM', () => {
    logger.ERROR({ error: 'process SIGTERM', url, port, channel }, 'publisher and subscriber quit', 'src/redis/redis-handler.js');
    publisher.quit();
    subscriber.quit();
  });

  obj.publish = function (name, content) {
    const message = {
      name,
      content,
    };
    publisher.publish(channel, JSON.stringify(message));
  };
  obj.publisher = publisher;
  obj.subscriber = subscriber;
  obj.channel = channel;

  return obj;
};

