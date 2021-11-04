import { duplicateChecker } from './socket-utils';
import configs from '../configs';
import functions, { logger } from '../resources/functions';

export default async({ io, socket, session }) => {
  socket.join(session.playerSession._id);
  duplicateChecker(io, socket, session.playerSession._id);
  console.log('user is connected!', session.playerSession.refActiveUser.displayname);
  const playerLog = await functions.db.playerLogs.save({ userId : session.user.userId, gameCode : session.user.gameCode, 
    username : session.user.username, server : 'Table' , serverId : configs.main.serverId});
  logger.INFO({ msg: playerLog }, 'playerLog in lobby', 'socket-connection.js')
};
