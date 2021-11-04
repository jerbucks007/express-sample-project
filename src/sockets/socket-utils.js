import configs from '../configs';
import functions, { logger } from '../resources/functions';
import api from '../resources/api';
import Promise, { config, delay } from 'bluebird';
import { evaluateMatchResultSBO } from '../resources/functions/game/game-utils';

/**
 * @function duplicateChecker
 * @description sent join information if the player is double connected
 * @param {Object}  io Server socket io object
 * @param {Object} socket players socket object
 * @param {String} userId id of the user
 */
export const duplicateChecker = (io, socket, userId) => {
  const roster = io.sockets.adapter.rooms[userId];
  if (roster !== null && roster !== undefined) {
    const clients = Object.keys(roster.sockets);
    if (clients !== null && clients !== undefined) {
      for (const client of clients) {
        const clientSocket = io.sockets.connected[client];
        if (clientSocket !== null && clientSocket !== undefined) {
          const user = clientSocket.handshake.session.playerSession;
          if ((user && user._id === userId) && clientSocket.id !== socket.id) {
            io.to(clientSocket.id).emit('server error', 'multiple window');
            clientSocket.disconnect();
          }
        }
      }
    }
  }
};

/**
 * @function removePlayerSession
 * @description This will remove the player session
 * @param {Object} socket Socket of the player
 * @param {Object} session Session of the player
 * @return This will return the player session, else false
 */
export const removePlayerSession = async (socket, session, sName, sMsg) => {
  if (sMsg !== 'invalid session') await functions.db.playerSessions.remove({ refActiveUser: session.playerSession.refActiveUser._id }, true);
  socket.emit(sName, sMsg);
  socket.disconnect();
  session.destroy();
  return false;
};

/**
 * @function getPlayersOnTable
 * @description This will get all the player that is inside the table
 * @param {Number} tableId The unique ID of the table
 * @returns {Array} This will return all the players inside the table
 */
export const getPlayersOnTable = async (tableId) => {
  // Get all the players inside the table from DB
  const playerQuery = { tableId, state: 0, idleCounter: { $lte: configs.interval.idleLimit } };
  const players = await functions.db.playerSessions.findWithPopulate(playerQuery, 'pos refActiveUser.userId', true);
  // Return only the specific information of the player
  const result = [];
  for (const player of players) {
    if (player.refActiveUser) {
      result.push({
        pos: player.pos,
        avatar: player.refActiveUser.avatar,
        displayname: player.refActiveUser.displayname,
      });
    }
  }
  return result;
};

export const addTableChips = async (session, table, data) => {
  const tableChipsQuery = { roundId: table.uniqueRoundId, tableId: table.uniqueTableId };
  const tableChips = await functions.db.tableChips.find(tableChipsQuery);
  const chipsObj = {
    player: session.playerSession.refActiveUser.displayname,
    amount: data.betAmount ? data.betAmount : data.stake,
    code: data.betType ? data.betType : data.code,
    exchangeRate: session.playerSession.exchangeRate.value || 0,
    destination: data.destination ? data.destination : null,
  };

  // Check if table chips is existing!
  if (!tableChips) {
    const tableChipsObj = {
      roundId: table.uniqueRoundId,
      tableId: table.uniqueTableId,
      chips: [chipsObj],
      shoeId: table.shoeId,
    };
    return await functions.db.tableChips.save(tableChipsObj);
  }
  return await functions.db.tableChips.updateChips(tableChipsQuery, { $push: { chips: chipsObj } });
};

/**
 * @function getLimit
 * @description Get the limit per bet options
 * @param {String} betType Type of bet options
 * @param {Object} tableLimit This is the table limit of player
 * @returns {Object} Return the min and max limit
 */
export const getLimit = (betType, tableLimit) => {
  if (betType === 'DRG' || betType === 'TGR') {
    return { min: tableLimit.dragontigerMin, max: tableLimit.dragontigerMax };
  } else if (betType === 'TIE') {
    return { min: tableLimit.tieMin, max: tableLimit.tieMax };
  } else if (betType.includes('BLK') || betType.includes('RED')) {
    return { min: tableLimit.suitcolorMin, max: tableLimit.suitcolorMax };
  } else if (betType.includes('BIG') || betType.includes('SML')) {
    return { min: tableLimit.bigsmallMin, max: tableLimit.bigsmallMax };
  }
};

export const computeTotalAmountOfBet = (bets, betType) => {
  let amount = 0;
  for (let i = 0, len = bets.length; i < len; i++) {
    if (betType === bets[i].code) amount += bets[i].stake;
  }
  return amount;
};

/**
 * @function checkLimit
 * @description Check the player limit on the table
 * @param {Object} bet Details of player bets
 * @param {Object} playerSession Session of the player
 * @param {Object} foundBet The existing bet of the player
 * @returns Return an string
 */
export const checkLimit = async (bet, playerSession, foundBet) => {
  const { min, max } = getLimit(bet.betType, playerSession.tableLimit);
  let amount = bet.betAmount;
  if (foundBet) {
    // let fbet;
    // for (const b of foundBet.bets) {
    //   if (b.code === bet.betType) { fbet = b; break; }
    // }
    const totalBetAmount = computeTotalAmountOfBet(foundBet.bets, bet.betType);
    amount = totalBetAmount ? totalBetAmount + bet.betAmount : bet.betAmount;
  }

  if (amount > max) return { msg: 'max limit', limit: max };
  else if (amount < min) return { msg: 'min limit', limit: min };
  return { msg: 'success' };
};

/**
 * @function checkRebetLimit
 * @description Check the player limit when using rebet
 * @param {Number} amount Amount per bet types
 * @param {String} betType Type of bets (DRG | TGR)
 * @param {Object} playerSession Session of the player
 * @returns Return an string
 */
export const checkRebetLimit = async (amount, betType, playerSession) => {
  const { min, max } = getLimit(betType, playerSession.tableLimit);
  if (amount > max) return 'max limit';
  else if (amount < min) return 'min limit';
  return 'success';
};

/**
 * @function getPlayerBalance
 * @description This function is to get the balance of the player
 * @param {Object} session Session of the player
 * @returns This return the current balance of the player
 */
export const getPlayerBalance = async (session) => {
  if (configs.main.isTest || configs.main.ENV === 'LAB_LCL') {
    // Get player balance
    const user = global.HOUSE === 'SBO' ? await functions.db.userLivecasinos.find({ PlayerId: (session.refActiveUser.userId)}, '') : await functions.db.users.find({ _id: session.userId }, '');
    return user.chips.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  }

  // Session expired
  if (!session.refActiveUser.clientId || !session.refActiveUser.sessionId) {
    return -2;
  }

  // Call the api for getting the player balance from the house
  const paramAPI = {
    clientId: session.refActiveUser.clientId,
    sessionId: session.refActiveUser.sessionId,
    playerIp : session.refActiveUser.playerIp,
  };

  const balance = await api.availableBalance(paramAPI, 'socket-utils => getPlayerBalance');
  try {
    if(balance.errorCode === 0){
      logger.NOTICE({msg : balance},'getPlayerBalance => GET PLAYER BALANCE SUCCESS', 'socket-utils.js');
      return balance.data.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    }else{
      logger.ERROR({msg : 'BALANCE FAILED' , balance : balance },'getPlayerBalance => GET PLAYER BALANCE FAILED', 'socket-utils.js');
      return -2;
    }
  } catch (error) {
      logger.ERROR({msg : 'BALANCE CATCH ERROR'  , error , error },'getPlayerBalance => GET PLAYER BALANCE CATCH ERROR', 'socket-utils.js');
      return -2;
  }
  
};

/**
 * @function sellBetOld
 * @description This will create a transaction of player and deduct the money depends on the bet
 * @param {Object} socket Player socket
 * @param {Object} session Session of the player
 * @param {Number} betAmount Total amount that player bet
 * @param {Object} table Information of the table
 */
export const sellBetOld = async (socket, session, betAmount, table, totalAmount) => {
  // Checker if what api to call (SELL BET | SUB-SELL BET)
  const isNewRound = socket.uniqueRoundId !== table.uniqueRoundId;
  let result = null;
  let transExtId = null;
  if (configs.main.isTest || configs.main.ENV === 'LAB_LCL') {
    const user = await functions.db.users.increment({ _id: session.playerSession.refActiveUser.userId, chips: { $gte: betAmount } }, { $inc: { chips: -betAmount } });
    if (!user) {
      socket.emit('game error', 'insufficient balance');
      return false;
    }
    socket.balance = user.chips;
  } else {
    // Use the sellbet if the player don't have existing record 
    // Use sub sellbet if player have existing record
    const paramAPI = {
      tableId: table.uniqueTableId,
      tableName: `${session.playerSession.tableLimit.tableLimitName} ${configs.main.appName}-${table.tableName}`,
      txnId: table.uniqueRoundId,
      txnDetId: socket.transId,
      subBetId: socket.subBetId,
      stake: betAmount,
      totalAmount,
      clients: {
        clientId: session.playerSession.refActiveUser.clientId,
        sessionId: session.playerSession.refActiveUser.sessionId,
        ip: session.playerSession.refActiveUser.ip,
        isMobile: session.playerSession.refActiveUser.isMobile,
        httpreff: session.playerSession.refActiveUser.httpreff,
      },
    };
    if (isNewRound) {
      result = await api.sellBet(paramAPI, 'socket-utils -> sellBet');
      if (result.failed === true) {
        socket.emit('game error notif', 'bet failed');
        return false;
      }
      transExtId = global.HOUSE === 'SBO' ? result.bets[0].gameBetStatus.extId : socket.transId;
      socket.balance = result.bets.clients[0].bet_credit;
    } else {
      const checkBal = await getPlayerBalance(session.playerSession, true);
      // This will subSellBbet be called when isNewRound is false
      result = await api.subSellBet(paramAPI, 'socket-utils - subSellbet');
      if (result.failed === true || (result.bets && result.bets.clients[0].error.code !== 0) || checkBal <= -2) {
        socket.emit('game error notif', 'bet failed');
        // socket.cantBet = true;
        return false;
      }
      socket.balance = result.bets.clients[0].bet_credit;
    }
  }

  if (isNewRound) {
    if (!transExtId) transExtId = socket.transId;
    await functions.db.playerBets.update({ transId: socket.transId }, { status: 1, transExtId });
  }

  return true;
};

/**
 * @function cancelBet
 * @description this will cancel the bet of the player
 * @param {Object} socket Player socket
 * @param {Object} session Session of the player
 * @param {Number} betAmount Total amount that player bet
 * @param {Object} table Information of the table
 */

export const cancelBet = async (io, session, player, table, totalAmount, transId) => {
  // Use the sellbet if the player don't have existing record 
  const paramAPI = {
    txnId: table.uniqueRoundId,
    clientId: player.clientId,
  };
  const result = await api.cancelBet(paramAPI, 'socket-utils -> cancelBet');
  if (result.failed === true) {
    
    return false;
  }
  return true;
};

/**
 * @function sellBet
 * @description This will create a transaction of player and deduct the money depends on the bet
 * @param {Object} io socket.io 
 * @param {String} clientSocket client socket for emit
 * @param {Object} player player info in playerBets
 * @param {Object} table information of table
 * @param {string} transId unique transactionId in player bets
 * @param {Number} totalAmount total amount per player bets
 * @param {Object} playerBetQuery query for specific player bets
 * @param {Array} bet list of player bets
 * @param {Array} cardResult This is the result of the round
 */
export const sellBet = async (io, clientSocket, player, table, totalAmount, transId, playerBetQuery , bets , cardResult, tableLimitName) => {
  // Checker if what api to call SELL BET
  if (configs.main.isTest || configs.main.ENV === 'LAB_LCL') {
    const user = global.HOUSE === 'SBO' ? await functions.db.userLivecasinos.increment({ PlayerId: player.userId, chips: { $gte: totalAmount } }, { $inc: { chips: -totalAmount } }) : 
    await functions.db.users.increment({ _id: player.userId, chips: { $gte: totalAmount } }, { $inc: { chips: -totalAmount } });
    if (!user) {
      io.to(clientSocket).emit('game error notif', 'insufficient balance');
      await functions.db.playerBets.update(playerBetQuery, { status: 2 });
    }else{
      io.to(clientSocket).emit('bet success', {errorCode : 0 , errorMessage : 'Success' , data : {balance : user.chips, transactionId : transId}});
      await functions.db.playerBets.update(playerBetQuery, { status: 1 });
      evaluateMatchResultSBO(table , cardResult , bets , player , totalAmount, playerBetQuery, transId , io , clientSocket);
    }
    
  } else {
    // Use the sellbet if the player don't have existing record 
    const paramAPI = {
      tableId: table.uniqueTableId,
      tableName: `${tableLimitName}${configs.main.appName}-${table.tableName}`,
      txnId: table.uniqueRoundId,
      txnDetId: transId,
      stake: totalAmount,
      totalAmount,
      clients: {
        clientId: player.clientId,
        sessionId: player.sessionId,
        ip: player.ip,
        isMobile: player.isMobile,
        httpreff: player.httpreff,
        playerIp : player.playerIp,
        gameCode : player.gameCode
      },
    };

    const result = api.sellBet(paramAPI, 'socket-utils -> sellBet');
    const promiseSellBet = Promise.resolve(result);
    promiseSellBet.timeout(5000).then(resSellBet =>{
      if (resSellBet.errorCode === 0) {
        // SELL BET SUCCESS
        io.to(clientSocket).emit('bet success', resSellBet);
        logger.NOTICE({ promiseSellBet : resSellBet }, 'PROMISE RESOLVE SELL BET SUCCESS', 'socket-utils.js');
        functions.db.playerBets.update(playerBetQuery, { status: 1 });
        // EVALUATE HERE
        evaluateMatchResultSBO(table , cardResult , bets , player , totalAmount, playerBetQuery, transId , io , clientSocket);
      }else{
        // SELL BET FAILED
        logger.NOTICE({ promiseSellBet : resSellBet }, 'PROMISE RESOLVE SELL BET FAILED', 'socket-utils.js');
        io.to(clientSocket).emit('game error', resSellBet.errorCode);
        functions.db.playerBets.update(playerBetQuery, { status: 2 });
      }
      
    }).catch(error => {
      logger.ERROR({ msg: 'Error promiseSellBet catch timeout 5000 sec' , error : error}, 'promiseSellBet CATCH ERROR', 'socket-utils.js');
      io.to(clientSocket).emit('game error', 'bet failed');
      functions.db.playerBets.update(playerBetQuery, { status: 2 });

      // call cancel bet if error
      setTimeout(async () => {
        const cancelbetAPI = api.cancelBet(paramAPI, 'socket-utils -> cancelBet');
        const promiseCancelBet = Promise.resolve(cancelbetAPI);
        promiseCancelBet.then(resCancelBet =>{
          logger.WARNING({ msg: 'CANCEL BET IS CALL' , resCancelBet : resCancelBet }, 'promiseCancelBet CALL', 'socket-utils.js');
        }).catch(error =>{
          logger.ERROR({ msg: 'Error cancel bet in catch', error : error }, 'CANCEL BET CATCH', 'socket-utils.js');
        })
      }, 1500);
    })

  }

};

