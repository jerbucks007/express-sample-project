import * as admin from './redis-admin';
import * as game from './redis-game';

export default (io) => {
  admin.listen({ io });
  game.listen({ io });
};
