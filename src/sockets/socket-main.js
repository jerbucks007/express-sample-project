import { getPlayersOnTable, removePlayerSession, checkLimit, sellBet, addTableChips } from './socket-utils';
import functions from '../resources/functions';

export default ({ io, socket, session }) => {
  socket.on('update settings', async (payload) => {
    switch (payload.type) {
      case 'sounds': {
        const updateQuery = { 'settings.isMute': payload.isMute || false };
        await functions.db.activeUsers.update({ _id: session.playerSession.refActiveUser._id }, updateQuery);
        break;
      }
      default: {
        break;
      }
    }
  });

  socket.on('window visibility', (visible) => {
    const { room } = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    if (visible) {
      socket.join(room);
    } else {
      socket.leave(room);
    }
  });

  socket.on('bot join room', async () => {
    // Get the table from the cache (class)
    const { room } = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    // Join the player into table socket
    socket.join(room);

    // Get all the player inside table
    const playerList = await getPlayersOnTable(session.playerSession.tableId);

    io.to(room).emit('player list', playerList);
  });

  socket.on('bot bet', async (data) => {
    // 1. Exit the code if no table ID was passed
    if (!session.playerSession.tableId || socket.pb) return false;

    // This is flag to make sure the process is done before doing another bet.
    socket.pb = true;

    const table = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    // 2. Exit Check if table is not existing and the state is not betting phase.
    if (!table || !table.tick.betInterval) return false;

    // if (socket.uniqueRoundId !== table.uniqueRoundId) {
    //   // Check player session if valid!
    //   if (!await functions.db.sessions.checkSession(session)) {
    //     socket.pb = false;
    //     return await removePlayerSession(socket, session, 'server error', 'invalid session');
    //   }
    // }

    // Query for player bet
    const playerBetQuery = { roundId: table.uniqueRoundId, 'player.username': session.playerSession.refActiveUser.username };
    // Find the player bet to DB
    const playerBet = await functions.db.playerBets.find(playerBetQuery);
    // Check if player bet is not exceeding the bet limit
    const chkLimit = await checkLimit(data, session.playerSession, playerBet);
    if (chkLimit.msg !== 'success') {
      const isMin = chkLimit.msg === 'min limit';
      data.betAmount = isMin ? chkLimit.limit : data.betAmount;
      socket.emit('game error notif', chkLimit.msg, isMin ? data : null);
      socket.pb = false;
      return false;
    }

    // Check if player have balance
    if (socket.balance && (socket.balance < data.betAmount)) {
      socket.emit('game error notif', 'insufficient balance');
      socket.pb = false;
      return false;
    }

    // Initialize the bet obj to be save/push into player bet
    const betObj = {
      code: data.betType,
      stake: data.betAmount,
      winloss: 0,
      win: false,
    };

    // Execute when no player bet was found
    if (!playerBet) {
      const player = { ...session.playerSession.refActiveUser._doc };
      player.tableLimit = session.playerSession.tableLimit.tableLimitName;
      const playerBetObj = {
        tableId: table.uniqueTableId,
        roundId: table.uniqueRoundId,
        player,
        bets: [betObj],
        totalPayout: 0,
        totalAmount: 0,
        totalEffectiveStake : 0,
        gameEnd: table.gameEnd,
        pos: data.pos,
        win: false,
      };

      // Save new player bet
      const savePb = await functions.db.playerBets.save(playerBetObj);
      socket.transId = savePb.transId;
    } else {
      socket.transId = playerBet.transId;
    }

    /**
     * This function will have the transaction of player
     * using the sellbet API for LAB,UAT,PRD.
     *  For LCL balance directly deducted to central point.
     */
    // const betSuccess = await sellBet(socket, session, data.betAmount, table);
    // if (!betSuccess) {
    //   // Checker if sell bet function was called
    //   if (socket.uniqueRoundId !== table.uniqueRoundId) await functions.db.playerBets.update(playerBetQuery, { status: 2 });
    //   socket.pb = false;
    //   return false;
    // }

    // Update the player idle counter and the socket bet ID
    if (socket.uniqueRoundId !== table.uniqueRoundId) {
      await functions.db.playerSessions.update({ _id: session.playerSession._id }, { idleCounter: 0 });
      socket.uniqueRoundId = table.uniqueRoundId;
    }

    // Will animate the chips from player to table
    io.to(table.room).emit('animate bet chips', data);
    socket.emit('get my balance', socket.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
    // Add table chips
    await addTableChips(session, table, data);

    // Will execute when player bet found above
    if (playerBet) {
      // Find the index of bet in bet array
      const betIndex = playerBet.bets.findIndex(b => b.code === data.betType);
      // Bet is already existing update bet!
      if (betIndex > -1) {
        const mapBet = playerBet.bets.map((b, i) => {
          const bCopy = b;
          if (i === betIndex) {
            bCopy.stake += data.betAmount;
          }
          return bCopy;
        });
        await functions.db.playerBets.updateBets(playerBetQuery, { $set: { bets: mapBet } });
      } else {
        // Execute when bet is no existing in the array
        await functions.db.playerBets.updateBets(playerBetQuery, { $push: { bets: betObj } });
      }
    }
    socket.pb = false;
    return true;
  });
};
