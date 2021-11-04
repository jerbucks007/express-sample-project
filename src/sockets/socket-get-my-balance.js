import functions from '../resources/functions';
import { getPlayerBalance, removePlayerSession } from './socket-utils';

export default ({ socket, session }) => {
  socket.on('get my balance', async () => {

    // Get the table from the cache (class)
    const { uniqueTableId, uniqueRoundId } = global.TABLECONTROLLER.getTable(session.playerSession.tableId);

    if (socket.gmb) return null;
    socket.gmb = true;
    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session)) {
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }

    // Get player balance
    let myBalance = await getPlayerBalance(session.playerSession);

    // If balance -2 => invalid session
    if (myBalance === -2) {
      await removePlayerSession(socket, session, 'server error', 'invalid session');
    } else if (myBalance === -3) {
      // If player state is 3 means player account was closed.
      await removePlayerSession(socket, session, 'game error', 'account closed');
    } else if (myBalance === -4) {
      // If player state is 4 means player account was suspended.
      await removePlayerSession(socket, session, 'game error', 'account suspended');
    } else {
      // check player bets for display of correct balance
      let findBalance = await functions.db.playerBets.find({tableId : uniqueTableId , roundId : uniqueRoundId , status : 0 , 'player.clientId' : session.playerSession.refActiveUser.clientId});
      if(findBalance){
        myBalance = myBalance - findBalance.totalAmount;
      }
      socket.balance = myBalance;
      socket.emit('get my balance', myBalance);
    }
    socket.gmb = false;
  });
};
