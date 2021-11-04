import functions, { logger } from '../resources/functions';
import { getPlayersOnTable, removePlayerSession } from './socket-utils';
import schemas from '../resources/schemas';

export default ({ io, socket, session }) => {
  socket.on('player sit', async (data) => {
    const schema = await schemas.schemaPlayerSit(data);
    if (!schema.isValid) {
      logger.ALERT({ msg: 'Invalid schema for player sit!', schema }, '[SOCKET] PLAYER SIT', 'socket-player-sit.js');
      return false;
    }

    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session)) {
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }

    // Get the table from the cache (class)
    const { uniqueTableId, uniqueRoundId, room, tick } = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    if (!uniqueTableId || !tick.betInterval) return false;

    // Check if seat is available
    const isSeatAvailable = await functions.db.playerSessions.count({ tableId: session.playerSession.tableId, pos: data.pos }) === 0;
    if (!isSeatAvailable) return false;

    // Query for player bet
    const playerBetQuery = { roundId: uniqueRoundId, 'player.userId': session.playerSession.refActiveUser.userId };
    // Find the player bet to DB
    const playerBet = await functions.db.playerBets.find(playerBetQuery);

    // Check if player have existing bet then update the position 
    if (playerBet) await functions.db.playerBets.update(playerBetQuery, { pos: data.pos });

    const player = await functions.db.playerSessions.find({ _id: session.playerSession._id });
    // When player is already seated and move to other seat without bet retain the counter.
    // Else make the counter 0. 
    const idleCounter = player.pos > -1 ? player.idleCounter : 0;
    
    // Update the idleCounter and position of player into DB.
    await functions.db.playerSessions.update({ _id: session.playerSession._id }, { idleCounter, pos: data.pos });

    // Get players inside the table
    const playerList = await getPlayersOnTable(session.playerSession.tableId);
    io.to(room).emit('player list', playerList);
  });
};
