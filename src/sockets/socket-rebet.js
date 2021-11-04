import functions, { logger } from '../resources/functions';
import { sellBet, checkRebetLimit, addTableChips, removePlayerSession } from './socket-utils';
import schemas from '../resources/schemas';
import configs from '../configs';

export default ({ io, socket, session }) => {
  /**
   * @socket rebet
   * @description It will perform the rebet functionalities
   */
  socket.on('rebet', async (data) => {
    const table = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    if(table.counter>50){
      let totalAmount = 0;
      const { bets, pos , er , displayname} = data;
      const newBet = bets.filter(bets => bets.code === 'TGR' || bets.code === 'DRG' || bets.code === 'TIE')
      for(const item of newBet){
        totalAmount += item.stake
      }
      data = {
        bets : newBet,
        totalAmount : totalAmount,
        pos : pos ,
        displayname: displayname,
        er : er,
      }
    }

    const { bets, pos, totalAmount } = data;
    // First condition if player have rebet
    if ((socket.rebet && socket.rebet === table.uniqueRoundId) || socket.pb || !socket.uniqueRoundId || !bets || pos === undefined || !totalAmount || table.state !== 1) return false;

    // Assign the uniqueRoundId to compare again when player bet
    socket.rebet = table.uniqueRoundId;

    // This is flag to make sure the process of bet is done before doing another bet.
    socket.pb = true;

    // Check the rebet schema if valid
    const schema = await schemas.schemaRebet(data, session.playerSession.tableLimit);
    if (!schema.isValid) {
      // socket.emit('game error notif', 'insufficient balance');
      socket.pb = false;
      logger.ALERT({ msg: 'Invalid schema for player sit!', schema }, '[SOCKET] PLAYER SIT', 'socket-player-sit.js');
      return false;
    }

    // 1.2 Check if player bet with the same position.
    const playerSession = await functions.db.playerSessions.find({ _id: session.playerSession._id });
    if (playerSession.pos !== data.pos || session.playerSession.refActiveUser.displayname !== data.displayname) {
      logger.ALERT({
        msg: 'Player position | displayname is not valid!',
        saveDisplayname: session.playerSession.refActiveUser.displayname,
        displayname: data.displayname,
        savePos: playerSession.pos,
        pos: data.pos,
      }, '[SOCKET] PLAYER RE-BET', 'socket-player-bet.js');
      socket.pb = false;
      return false;
    }

    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session)) {
      return await removePlayerSession(socket, session, 'server error', 'invalid session');
    }

    // Second condition if player attemp to rebet again
    const playerBet = await functions.db.playerBets.find({ roundId: table.uniqueRoundId, 'player.userId': session.playerSession.refActiveUser.userId });
    if (playerBet) return false;

    // Check the bet of player if it exceeds or meet the table limit
    for (const bet of bets) {
      const limit = await checkRebetLimit(bet.stake, bet.code, session.playerSession);
      if (limit !== 'success') {
        socket.pb = false;
        socket.emit('game error notif', limit);
        return false;
      }
    }

    // Third condition check if player don't have balance
    if (socket.balance !== undefined && (socket.balance < totalAmount)) {
      socket.emit('game error notif', 'insufficient balance');
      socket.pb = false;
      return false;
    }else{
      socket.balance = socket.balance - totalAmount;
    }
    const mapBets = bets.map((bet, i) => ({
      subBetId: i + 1,
      code: bet.code,
      stake: bet.stake,
      effectiveStake : bet.stake,
      winloss: 0,
      win: false,
      txnDate: new Date(),
    }));
    // console.log(mapBets);
    // Update the idling of the payer when rebet
    await functions.db.playerSessions.update({ _id: session.playerSession._id }, { idleCounter: 0 });
    const player = { ...session.playerSession.refActiveUser._doc };
    player.tableLimit = session.playerSession.tableLimit.tableLimitName;
    const rebetObj = {
      tableId: table.uniqueTableId,
      roundId: table.uniqueRoundId,
      bets: mapBets,
      player,
      totalPayout: 0,
      totalAmount: totalAmount,
      totalEffectiveStake : totalAmount,
      gameEnd: table.gameEnd,
      win: false,
      pos,
      clientSocket : session.playerSession._id,
      tableLimitName : session.playerSession.tableLimit.tableLimitName
    };

    // Save the transId to socket so it can access via socket
    const saveBet = await functions.db.playerBets.save(rebetObj);
    const paramQuerry = `${configs.main.intENV}-${player.gameCode}-${saveBet.transId}`;
    const updateSaveBet = await functions.db.playerBets.update({transId : saveBet.transId},{transId : paramQuerry})

    socket.transId = updateSaveBet.transId;

    /**
     * This function will have the transaction of player
     * using the sellbet API for LAB,UAT,PRD.
     * For LCL balance directly deducted to central point.
     */
    // const betSuccess = await sellBet(socket, session, totalAmount, table, totalAmount);
    // if (!betSuccess) {
    //   socket.pb = false;
    //   return false;
    // }
    // This will be the checker for sellbet and sub-sellbet
    socket.uniqueRoundId = table.uniqueRoundId;
    socket.pb = false;
    socket.emit('rebet', { bets, pos });
    socket.emit('get my balance', socket.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
    // Add table chips
    const requests = bets.map(bet => addTableChips(session, table, bet));
    await Promise.all(requests);
    // for (const bet of bets) {
    //   await addTableChips(session, table, bet);
    // }
  });

  /**
 * @socket rebet chips
 * @description This is for the animation of the chips that will be sent to table 
 */
  socket.on('rebet chips', async (data) => {
    const table = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    io.to(table.room).emit('rebet chips', data);
  });

  /**
 * @socket rebet status
 * @description This is to check the status of the rebet
 */
  socket.on('rebet status', async () => {
    socket.emit('rebet status', !!socket.uniqueRoundId);
  });
};
