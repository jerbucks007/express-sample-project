import functions, { logger } from '../resources/functions';
import { removePlayerSession, getPlayersOnTable } from './socket-utils';
import schemas from '../resources/schemas';

export default ({ io, socket, session }) => {
  socket.on('change avatar', async (avatar) => {
    const schema = await schemas.schemaAvatar(avatar);
    if (!schema.isValid) {
      logger.ALERT({ msg: 'Invalid schema for avatar!', schema }, '[SOCKET] AVATAR', 'socket-avatar.js');
      return false;
    }
    
    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session)) {
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }

    const { _id, userId } = session.playerSession.refActiveUser;
    await functions.db.userDatas.update({ userId }, { avatar });
    await functions.db.activeUsers.update({ _id }, { avatar });

    const table = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    const playerList = await getPlayersOnTable(table.uniqueTableId);
    io.to(table.room).emit('player list', playerList);
  });
};
