import functions, { logger } from '../resources/functions';
import { removePlayerSession } from './socket-utils';

export default ({ io, socket, session }) => {
  socket.on('player taunt', async (data) => {
    if (socket.taunt) return false;
    socket.taunt = true;

    // Check if player bet with the same position.
    const playerSession = await functions.db.playerSessions.find({ _id: session.playerSession._id });
    if (playerSession.pos !== data.pos || session.playerSession.refActiveUser.displayname !== data.displayname) {
      logger.ALERT({
        msg: 'Player position | displayname is not valid!',
        saveDisplayname: session.playerSession.refActiveUser.displayname,
        displayname: data.displayname,
        savePos: playerSession.pos,
        pos: data.pos,
      }, '[SOCKET] PLAYER TAUNT', 'socket-player-bet.js');
      socket.pb = false;
      return false;
    }

    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session)) {
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }

    const table = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    io.to(table.room).emit('player taunt', data);
    socket.taunt = false;
  });
};
