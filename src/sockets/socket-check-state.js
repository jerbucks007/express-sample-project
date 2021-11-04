import functions from '../resources/functions';
import { removePlayerSession } from './socket-utils';
import configs from '../configs';

export default ({ socket, session }) => {
  socket.on('check state', async () => {
    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session)) {
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }
    const { room } = global.TABLECONTROLLER.getTable(session.playerSession.tableId);

    // Check player session if existing
    const player = await functions.db.playerSessions.find({ _id: session.playerSession._id }, 'idleCounter pos state');
    if (!player) return await removePlayerSession(socket, session, 'server error', 'invalid session');
    // If player is seated, will be stand from seat for idling  
    // 3 consecutive rounds without betting
    if (player.pos > -1 && player.idleCounter > 3) {
      socket.emit('game error', 'stand player');
    } else if (player.pos === -1 && player.idleCounter > configs.interval.idleLimit) {
      // If player is standing, will be out for the game if idling 
      // 5 consecutive rounds without betting
      socket.emit('game error', 'kick player');
      socket.leave(room);
    } else if (player.state === 1) {
      // If player state is 1 means player table limit was closed from admin
      socket.emit('game error', 'table limit close');
      socket.leave(room);
    } else if (player.state === 2) {
      // If player state is 2 means table was booted from the admin
      await removePlayerSession(socket, session, 'game error', 'player booted');
    } else if (player.state === 3) {
      // If player state is 3 means player account was closed.
      await removePlayerSession(socket, session, 'game error', 'account closed');
    } else if (player.state === 4) {
      // If player state is 4 means player account was suspended.
      await removePlayerSession(socket, session, 'game error', 'account suspended');
    }
  });

};
