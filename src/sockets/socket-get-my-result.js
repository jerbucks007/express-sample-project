import functions from '../resources/functions';

export default ({ socket, session }) => {
  socket.on('get my result', async () => {
    // Check player session if valid!
    //   if (!await functions.db.sessions.checkSession(session)) {
    //   return await removePlayerSession(socket, session, 'server error', 'invalid session');
    // }

    const table = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    // Find the players total bet
    const playerBet = await functions.db.playerBets.find({
      roundId: table.uniqueRoundId,
      'player.userId': session.playerSession.refActiveUser.userId,
      tableId: table.uniqueTableId,
    }, '-_id totalAmount totalPayout totalEffectiveStake pos');

    if (playerBet) socket.emit('get my result', playerBet);
  });
};
