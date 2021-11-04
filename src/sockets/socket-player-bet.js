import functions, { logger } from '../resources/functions';
import { checkLimit, sellBet, addTableChips, removePlayerSession } from './socket-utils';
import schemas from '../resources/schemas';
import configs from '../configs';
/**
 * PROCESS
 *  1. Check if have player session And the process for bet is done
 *  1.1. Validate the data using schema.
 *  1.2 Check if player bet with the same position.
 *  2. Check if round is on betting phase
 *  3. Check the session -> update session if not expired
 *  4. Find the player bet 
 *  5. Check if player bet is not exceeding to table/bet limit
 *  6. Save player bet if not existing
 *  7. Do the SELLBET API(LAB|UAT|PRD) -> If first bet do the sell bet, If second bet do sub sell bet  
 *  7.1. (LCL) Directly deduct the balance
 *  8. Update the idle counter to 0 (reset) once
 *  9. Save table chips
 *  10. If player bet is existing, Update the player bet in db else create new
 */
export default ({ io, socket, session }) => {
  socket.on('player bet', async (data) => {
    // 1. Exit the code if no table ID was passed
    if (!session.playerSession.tableId || socket.pb || socket.cantBet) {
		socket.emit('game error notif', "");
		return false;
	}

    // This is flag to make sure the process is done before doing another bet.
    socket.pb = true;

    // 1.1 check the schema of for bet
    const schema = await schemas.schemaPlayerBet(data);
    if (!schema.isValid) {
      logger.ALERT({ msg: 'Invalid schema for bet!', schema }, '[SOCKET] PLAYER BET', 'socket-player-bet.js');
      socket.pb = false;
	    socket.emit('game error notif', "");
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
      }, '[SOCKET] PLAYER BET', 'socket-player-bet.js');
      socket.pb = false;
	    socket.emit('game error notif', "");
      return false;
    }

    const table = global.TABLECONTROLLER.getTable(session.playerSession.tableId);
    // 2. Exit Check if table is not existing and the state is not betting phase.
    if (!table || !table.tick.betInterval || table.state !== 1){
      console.log('ERRROOR STATEEEEEE', { msg: 'bet on table state not 1!', state: table.state });
      socket.pb = false;
	    socket.emit('game error notif', "");
      return false;
    }

    if (socket.uniqueRoundId !== table.uniqueRoundId) {
      // Check player session if valid!
      if (!await functions.db.sessions.checkSession(session)) {
        socket.pb = false;
		    socket.emit('game error notif', "");
        return await removePlayerSession(socket, session, 'server error', 'invalid session');
      }
    }

    // Query for player bet
    const playerBetQuery = { roundId: table.uniqueRoundId, 'player.userId': session.playerSession.refActiveUser.userId };
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
    if (socket.balance !== undefined && (socket.balance < data.betAmount)) {
      socket.emit('game error notif', 'insufficient balance');
      socket.pb = false;
      return false;
    }else{
      socket.balance = socket.balance - data.betAmount;
    }

    // checker disable side bet
    let disableSidebet = false;
    if(table.counter>50){
      if(data.betType === 'DRG' || data.betType === 'TGR' || data.betType === 'TIE'){
        logger.NOTICE({ msg: 'side bet allowed!', betType: data.betType , counter : table.counter , roundId : table.uniqueRoundId , tableId : table.uniqueTableId}, '[SOCKET] PLAYER BET', 'socket-player-bet.js');
        disableSidebet = false;
      }else{
        logger.ERROR({ msg: 'side bet is not allowed!', betType: data.betType , counter : table.counter , roundId : table.uniqueRoundId , tableId : table.uniqueTableId}, '[SOCKET] PLAYER BET', 'socket-player-bet.js');
        socket.pb = false;
        disableSidebet = true;
        socket.emit('game error notif', "");
        return false;
      }
    }

    if(!disableSidebet){
      socket.subBetId = playerBet && playerBet.bets ? playerBet.bets.length + 1 : 1;

      // Initialize the bet obj to be save/push into player bet
      const betObj = {
        subBetId: socket.subBetId,
        code: data.betType,
        stake: data.betAmount,
        effectiveStake : data.betAmount,
        winloss: 0,
        win: false,
        txnDate: new Date(),
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
          totalAmount: data.betAmount,
          totalEffectiveStake : data.betAmount,
          gameEnd: table.gameEnd,
          pos: data.pos,
          win: false,
          clientSocket : session.playerSession._id,
          tableLimitName : session.playerSession.tableLimit.tableLimitName
        };
        // Save new player bet
        if(configs.main.testLoopBet){ // for testting purpose
          for(let x = 0; x<50;x++){
            if(socket.balance > data.betAmount){
              const saveBet = await functions.db.playerBets.save(playerBetObj);
              const paramQuerry = `${configs.main.intENV}-${player.gameCode}-${saveBet.transId}`;
              const updateSaveBet = await functions.db.playerBets.update({transId : saveBet.transId , 'player.userId' : player.userId},{transId : paramQuerry})
              socket.transId = updateSaveBet.transId;
              socket.balance = socket.balance - data.betAmount;
            }
          }
          
        }
        else{
          const saveBet = await functions.db.playerBets.save(playerBetObj);
          const paramQuerry = `${configs.main.intENV}-${player.gameCode}-${saveBet.transId}`;
          const updateSaveBet = await functions.db.playerBets.update({transId : saveBet.transId , 'player.userId' : player.userId},{transId : paramQuerry})
          logger.NOTICE({ msg: 'PLAYER BET!', playerBet : updateSaveBet }, '[SOCKET] PLAYER BET', 'socket-player-bet.js');
          socket.transId = updateSaveBet.transId;          
        }
      } else {
        socket.transId = playerBet.transId;
      }
  
      // Compute the total Amount for SBO
      const totalAmount = playerBet ? playerBet.totalAmount + data.betAmount : data.betAmount;
      const totalEffectiveStake = playerBet ? playerBet.totalAmount + data.betAmount : data.betAmount;
  
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
        // Execute when bet is no existing in the array
        await functions.db.playerBets.updateBets(playerBetQuery, { $push: { bets: betObj }, $set: { totalAmount, totalEffectiveStake } });
        const playerBet = await functions.db.playerBets.find(playerBetQuery);
        logger.NOTICE({ msg: 'PLAYER BET UPADATE!', playerBet : playerBet}, '[SOCKET] PLAYER BET UPDATE', 'socket-player-bet.js');
      }
    }

    socket.pb = false;
    return true;
  });
};
