import redis from '../redis';

export default async ({ io }) => {
  redis(io);
};
