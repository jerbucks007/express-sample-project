import functions, { logger } from '../resources/functions';
import { getPlayersOnTable, getPlayerBalance, removePlayerSession } from './socket-utils';
import { generateRoadMap } from '../resources/functions/game/game-utils';
import configs from '../configs';

export default ({ io, socket, session }) => {
  socket.on('join room', async () => {
    if (socket.joinRoom) return false;
    socket.joinRoom = true;

    // Get player position
    const findPlayer = await functions.db.playerSessions.find({ _id: session.playerSession._id }, '-_id pos state');

    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session) || !findPlayer) {
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }

    // If player state is 1 means player table limit was closed from admins
    if (findPlayer.state === 1) {
      socket.emit('game error', 'table limit close');
      return socket.disconnect();
    }

    // Get the table from the cache (class)
    const { uniqueTableId, shoeId, uniqueRoundId, room, state, tick, gameEnd , counter , tableName} = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    if (!uniqueTableId) return false;
    // If table state = 2, Table was closed!
    if (state === 2) {
      socket.emit('game error', 'table close');
      return socket.disconnect();
    }

    const bettingTimer = Math.floor((gameEnd.getTime() - new Date().getTime()) / 1000);
    const idleCounter = tick.betInterval && bettingTimer >= -20 ? 0 : -1;
    await functions.db.playerSessions.update({ _id: session.playerSession._id }, { idleCounter });
    
    // Get player balance
    let myBalance = await getPlayerBalance(session.playerSession);

    // check player bets for display of correct balance
    let findBalance = await functions.db.playerBets.find({tableId : uniqueTableId , roundId : uniqueRoundId , status : 0 , 'player.clientId' : session.playerSession.refActiveUser.clientId});
    if(findBalance){
      myBalance = myBalance - findBalance.totalAmount;
    }
    
    // Status player to the house
 
    // If balance -2 => invalid session
    if (myBalance === -2 ) {
      logger.ALERT({ msg: 'Failed request to API', myBalance }, '[SOCKET] JOIN ROOM', 'socket-join-room.js')
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }

    logger.INFO({ room, player: session.playerSession.refActiveUser.username }, '[SOCKET] => JOIN ROOM', 'socket-join-room.js');

    // Join the player into table socket
    socket.join(room);

    // Generate the road map
    const roadmap = await generateRoadMap(uniqueTableId, shoeId);

    // Get all the current bets on the table
    const tableChips = await functions.db.tableChips.find({ tableId: uniqueTableId, roundId: uniqueRoundId }, 'chips -_id');

    // Get the current player bets
    const myBets = await functions.db.playerBets.find({
      roundId: uniqueRoundId, 'player.userId': session.playerSession.refActiveUser.userId, tableId: uniqueTableId,
    }, 'pos bets -_id');

    // Check if player have bets on that round then enable the rebet
    if (myBets) socket.uniqueRoundId = uniqueRoundId;

    // Get all the player inside table
    const playerList = await getPlayersOnTable(session.playerSession.tableId);

    let tableLimit = {};
    if(session.playerSession.tableLimit === null){
      tableLimit = {
        defaultChip: null,
        dragontigerMin: null,
        dragontigerMax: null,
        tieMin: null,
        tieMax: null,
        suitcolorMin: null,
        suitcolorMax: null,
        bigsmallMin: null,
        bigsmallMax: null,
      };
    }else{
      tableLimit = {
        defaultChip: session.playerSession.tableLimit.defaultChip,
        dragontigerMin: session.playerSession.tableLimit.dragontigerMin,
        dragontigerMax: session.playerSession.tableLimit.dragontigerMax,
        tieMin: session.playerSession.tableLimit.tieMin,
        tieMax: session.playerSession.tableLimit.tieMax,
        suitcolorMin: session.playerSession.tableLimit.suitcolorMin,
        suitcolorMax: session.playerSession.tableLimit.suitcolorMax,
        bigsmallMin: session.playerSession.tableLimit.bigsmallMin,
        bigsmallMax: session.playerSession.tableLimit.bigsmallMax,
      };
    }


    io.to(room).emit('player list', playerList);

    const maxPlayer = configs.main.maxPlayerPerTable;

    // Send the data to client
    socket
      .emit('my position', findPlayer.pos)
      .emit('get my balance', myBalance)
      .emit('table limit', tableLimit)
      .emit('table state' , { tableName: tableName , maxPlayer : maxPlayer , state : state})
      .emit('road map', roadmap)
      .emit('table chips', tableChips)
      .emit('my bets', myBets)
      .emit('new game round', {roundId : uniqueRoundId , counter : counter})
      .emit('rebet status', false);
  });
};
