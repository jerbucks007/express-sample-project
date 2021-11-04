import db from '../db';
import { evaluateCardResult, evaluatePlayerBets } from './game-evaluation';
import configs from '../../../configs';
import classes from '../../classes';
import api from '../../api';
import constantMaxPayout from '../../constants/constant-max-payout';
import logger from '../function-log';

const roadMap = new classes.roadMap();

/**
 * @function generateRoadMap
 * @description This will generate all kinds of roadmap BEAD, BIG, BIG EYE, SMALL EYE, COCROACH ROAD.
 * @param {Number} tableId The unique ID of the table
 * @param {Number} shoeId The current shoe of the table
 * @returns {Array} This will return all the roadmap
 */
export const generateRoadMap = async (tableId, shoeId) => {
  // Find the big road for the table
  const roadmapDB = await db.gameReports.findSort({ tableId, shoeId, cardResult: { $nin: [null , [] ]  }}, '-_id roadmap', { roundId: 1 }, true);
  const mapRoad = roadmapDB.map((x) => x.roadmap);

  // Generate all kinds of roadmap bead, big, big eye, small eye, cockroach
  const roadmap = roadMap.generateRoadmap(mapRoad);
  const roadmapResult = roadMap.getResult();
  return { roadmap, roadmapResult };
};

/**
 * @function burnCards
 * @description The function will burn the cards from the shoe
 * @param {Number} tableId The unique ID of the table
 * @param {Number} totalBurn Total cards to be burn on the shoe
 * @return This will return if success
 */
export const burnCards = async (tableId, totalBurn) => {
  const shuffleCard = global.TABLECONTROLLER.burnCards(tableId, totalBurn);
  return await db.tables.update({ uniqueTableId: tableId }, { shuffleCard });
};

/**
 * @function createGameReport
 * @description Creating the report for the game every start of new round
 * @param {Number} tableId The unique ID of the table
 * @return This will return if the creation is succes
 */
export const createGameReport = async (tableId, firstBurnCard) => {
  // Get the updated table information
  const { bettingTimer, tableName, uniqueRoundId, shoeId, uniqueTableId } = global.TABLECONTROLLER.getTable(tableId);
  // This execute when Game report is not exiting, 
  const gameEnd = new Date(new Date().getTime() + (bettingTimer * 1000));
  // save new game report
  const reportObj = {
    gameStart: new Date(),
    roundId: uniqueRoundId,
    tableId: uniqueTableId,
    gameResult: [],
    cardResult: null,
    firstBurnCard: firstBurnCard || '',
    gameEnd,
    tableName,
    shoeId,
  };

  // Update the game end of table every time start new round
  await db.tables.update({ uniqueTableId }, { gameEnd });
  global.TABLECONTROLLER.updateTable(tableId, { gameEnd });
  return await db.gameReports.save(reportObj);
};

/**
 * @function evaluateMatchResult
 * @description Evaluate the match result of the round
 * @param {Number} tableId The unique ID of the table
 * @param {Array} cardResult This is the result of the round
 * @return {Object} This will return an object that will be pass to the client
 */
export const evaluateMatchResult = async (tableId, cardResult) => {
  // Get the dragon and tiger card value
  const { dragon, tiger } = cardResult;
  // Evaluate the card winning result
  const evalCardResult = evaluateCardResult(dragon, tiger);
  // Get table information
  const { uniqueRoundId, tableName } = global.TABLECONTROLLER.getTable(tableId);

  // Get all the running player bets for the current round
  const playerBets = await db.playerBets.find({ roundId: uniqueRoundId, status: 1 }, '', true);
  // Iterate the found player bets from DB
  let promise = null;
  for (const item of playerBets) {
    // Compute the player bets based on card result
    const bets = evaluatePlayerBets(evalCardResult, item.bets);

    let status = 3; // This will determine if player bet is successfully evaluated
    const totalAmount = item.totalAmount;
    let totalPayout = 0 ;
    let effectiveStake = 0;

    for (const bet of bets) {
      totalPayout += bet.winloss;
      // get effective stake
      effectiveStake += bet.effectiveStake;
    }
    const totalEffectiveStake = effectiveStake;
    // Check the current payout if exceeds the maximum payout. 
    totalPayout = totalPayout > constantMaxPayout[item.player.currency] ? constantMaxPayout[item.player.currency] : totalPayout;
    const win = totalPayout > 0;
    
    if ((configs.main.isTest || configs.main.ENV === 'LAB_LCL')) {
      await db.users.update({_id: item.player.userId} , {$inc: { chips: totalPayout } })
    } else {
      // update all playerBet Status to 3
      await db.playerBets.update({_id: item._id} , { bets, totalPayout, totalAmount, win, status , totalEffectiveStake})

      // check if resultbet is success
      // set status 4 is success else 5 if failed
      const playerBet = {
        roundId: item.roundId,
        transId: item.transId,
        player: item.player,
        tableLimit: item.player.tableLimit || '',
        bets,
        totalPayout,
        totalAmount,
        win,
        effectiveStake,
        totalEffectiveStake,
      };
     
      const paramAPI = constructResultBet(table.uniqueTableId, tableName, playerBet, cardResult);
      const result = await api.resultBet(paramAPI, 'game-utils.js -> evaluateMatchResult');
      promise = Promise.resolve(result);
      promise.then(resResolve =>{
        if(resResolve.failed === true || resResolve.errorCode === 404 || resResolve.errorCode === 410){
          logger.ERROR({error : result},'evaluateMatchResult => api.resultBet response', 'game-utils.js')
          db.playerBets.update({_id: item._id} , {status : 5})
        }else if(resResolve.errorCode === 409 || resResolve.errorCode === 0){
          logger.NOTICE({error : result},'evaluateMatchResult => api.resultBet response', 'game-utils.js');
          db.playerBets.update({_id: item._id} , {status : 4})
        }
      }).catch(error =>{
        logger.ERROR({error : error , result : result},'evaluateMatchResult => api.resultBet catch ERROR', 'game-utils.js');
        db.playerBets.update({_id: item._id} , {status : 5});
      })
    }
  }

  // Find all the player bets that was evaluated (4)!
  const playerBetsResult = await db.playerBets.find({ roundId: uniqueRoundId, status: 4 }, '-_id pos bets totalAmount totalPayout totalEffectiveStake', true);

  // Return all the updated player bets
  return {
    gameResult: evalCardResult,
    playerBets: playerBetsResult,
  };
};

/**
 * @function evaluateMatchResultSBO
 * @description Evaluate the match result of the round
 * @param {Object} table information of table
 * @param {Array} cardResult This is the result of the round
 * @param {Array} playerBets array of bets in playerbets
 * @param {Object} player object info of player in player bets
 * @param {Number} totalAmount total amount of bets per player
 * @param {Object} playerBetQuery query for player bets update
 * @param {String} transId unique transaction id of player bets
 */
export const evaluateMatchResultSBO = async (table, cardResult , playerBets, player , totalAmount, playerBetQuery , transId) => {
  // Get the dragon and tiger card value
  const { dragon, tiger } = cardResult;
  // Evaluate the card winning result
  const evalCardResult = evaluateCardResult(dragon, tiger);
  // Get table information
  const { uniqueRoundId, tableName } = global.TABLECONTROLLER.getTable(table.uniqueTableId);

  let promise = null;

  // Compute the player bets based on card result
  const bets = evaluatePlayerBets(evalCardResult, playerBets);

  let status = 3; // This will determine if player bet is successfully evaluated
  let totalPayout = 0 ;
  let effectiveStake = 0;

  for (const bet of bets) {
    totalPayout += bet.winloss;
    // get effective stake
    effectiveStake += bet.effectiveStake;
  }
  const totalEffectiveStake = effectiveStake;
  // Check the current payout if exceeds the maximum payout. 
  totalPayout = totalPayout > constantMaxPayout[player.currency] ? constantMaxPayout[player.currency] : totalPayout;
  const win = totalPayout > 0;
    
  if ((configs.main.isTest || configs.main.ENV === 'LAB_LCL')) {
    await db.playerBets.update(playerBetQuery , { bets, totalPayout, totalAmount, win, status: 4 , totalEffectiveStake});
    await db.userLivecasinos.increment({ PlayerId: player.userId} , {$inc: { chips: totalPayout } });
  } 
  else {
    // update all playerBet Status to 3
    await db.playerBets.update(playerBetQuery , { bets, totalPayout, totalAmount, win, status , totalEffectiveStake})

    // check if resultbet is success
    // set status 4 is success else 5 if failed
    const playerBet = {
      roundId: table.uniqueRoundId,
      transId: transId,
      player: player,
      tableLimit: player.tableLimit || '',
      bets,
      totalPayout,
      totalAmount,
      win,
      effectiveStake,
      totalEffectiveStake,
    };
     
    const paramAPI = constructResultBet(table.uniqueTableId, tableName, playerBet, cardResult);
    const result = await api.resultBet(paramAPI, 'game-utils.js -> evaluateMatchResult');
    promise = Promise.resolve(result);
    promise.then(resResolve =>{
      if(resResolve.errorCode === 404 || resResolve.errorCode === 410){
        logger.ERROR({error : resResolve},'evaluateMatchResult => api.resultBet response', 'game-utils.js')
        db.playerBets.update(playerBetQuery , {status : 2})
      }else if(resResolve.errorCode === 409 || resResolve.errorCode === 0){
        logger.NOTICE({result : resResolve},'evaluateMatchResult => api.resultBet response', 'game-utils.js');
        db.playerBets.update(playerBetQuery , {status : 4})
      }else{
        logger.ERROR({error : resResolve},'evaluateMatchResult => api.resultBet response', 'game-utils.js')
        db.playerBets.update(playerBetQuery , {status : 5})
      }
    }).catch(error =>{
      logger.ERROR({error : error , result : result},'evaluateMatchResult => api.resultBet catch ERROR', 'game-utils.js');
      db.playerBets.update(playerBetQuery , {status : 5});
    })
  }
};

/**
 * @function showResultSBO
 * @description Evaluate the match result of the round
 * @param {Number} tableId The unique ID of the table
 * @param {Array} cardResult This is the result of the round
 * @return {Object} This will return an object that will be pass to the client
 */
export const showResultSBO = async (tableId, cardResult) => {
  // Get the dragon and tiger card value
  const { dragon, tiger } = cardResult;
  // Evaluate the card winning result
  const evalCardResult = evaluateCardResult(dragon, tiger);
  // Get table information
  const { uniqueRoundId } = global.TABLECONTROLLER.getTable(tableId);

  // Find all the player bets that was evaluated (4)!
  const playerBetsResult = await db.playerBets.find({ roundId: uniqueRoundId, status: 4 }, '-_id pos bets totalAmount totalPayout totalEffectiveStake', true);

  // Return all the updated player bets
  return {
    gameResult: evalCardResult,
    playerBets: playerBetsResult,
  };
};

/**
 * @function constructResultBet
 * @description This is to construct the result bet for the house
 * @param {String} tableId Unique ID of the table
 * @param {String} tableName Name of the table
 * @param {Object} playerBet The details of player bets
 * @param {Object} cardResult The result for dragon | tiger cards
 * @returns Return an constructed data
 */
export const constructResultBet = (tableId, tableName, playerBet, cardResult) => {
  const betSynonyms = {
    DRG: 'dragon',
    TGR: 'tiger',
    TIE: 'tie',
    TGRBIG: 'tiger_big',
    TGRSML: 'tiger_small',
    TGRRED: 'tiger_red',
    TGRBLK: 'tiger_black',
    DRGBIG: 'dragon_big',
    DRGSML: 'dragon_small',
    DRGRED: 'dragon_red',
    DRGBLK: 'dragon_black',
  };

  const obj = {};
  obj.table = {
    table_id: tableId,
    table_name: `${playerBet.tableLimit} ${configs.main.appName}-${tableName}`,
  };
  obj.txn_id = `${configs.main.intENV}-${playerBet.player.gameCode}-${playerBet.transId}`;
  obj.txn_det_id = playerBet.transId;
  // added for sbo resultBet
  obj.BetResultReq = {
    WinAmount : playerBet.totalPayout,
    Stake : playerBet.totalAmount,
    EffectiveStake : playerBet.effectiveStake,
    PlayerId : playerBet.player.clientId,
    GameCode : playerBet.player.gameCode
  }

  const clients = [];
  const cObj = {};
  cObj.client_id = playerBet.player.clientId;
  cObj.stake = playerBet.totalAmount;
  cObj.totalEffectiveStake = playerBet.totalEffectiveStake;
  cObj.winlost = playerBet.totalPayout;
  cObj.status = playerBet.win ? 'W' : 'L';
  cObj.message = '';
  cObj.gross_rake = 0;
  cObj.winner = {};

  const dragonNum = Number(cardResult.dragon.replace(/\D/g, ''));
  const tigerNum = Number(cardResult.tiger.replace(/\D/g, ''));

  const dragon = dragonNum === 10 ? `T${cardResult.dragon[cardResult.dragon.length - 1]}` : cardResult.dragon;
  const tiger = tigerNum === 10 ? `T${cardResult.tiger[cardResult.tiger.length - 1]}` : cardResult.tiger;

  const result = {
    table: `${playerBet.tableLimit} ${configs.main.appName}-${tableName}`,
    n: playerBet.bets.length,
    bets: {},
    result: { hand: { tiger, dragon } },
    winnings: {},
  };
  for (const bet of playerBet.bets) {
    result.bets[betSynonyms[bet.code]] = result.bets[betSynonyms[bet.code]] ? result.bets[betSynonyms[bet.code]] + bet.stake : bet.stake;
    if (bet.win) {
      result.winnings[betSynonyms[bet.code]] =
        result.winnings[betSynonyms[bet.code]] ? result.winnings[betSynonyms[bet.code]] + bet.winloss : bet.winloss;
    }
  }

  cObj.result = JSON.stringify(result);
  clients.push(cObj);
  obj.clients = clients;
  return obj;
};

/**
 * @function updatePlayerState
 * @description Stand all the player that is idling for how many rounds
 * @param {Number} tableId The unique ID of the table
 * @return This will return true if success, else false
 */
export const updatePlayerState = async (tableId) => {
  // If player is seated, will be stand from seat for idling  
  // 3 consecutive rounds without betting
  const standQuery = { tableId, pos: { $gt: -1 }, idleCounter: { $gt: 3 } };
  // Update the idle to 0 and the pos to -1 (standing)
  await db.playerSessions.update(standQuery, { idleCounter: 0, pos: -1 }, true);

  return true;
};

/**
 * @function updateTableState
 * @description Update the state of the table into DB
 * @param {Number} tableId The unique ID of the table
 * @param {Number} state The current state of the round 0=>Betting close, 1=>Betting Open
 * @returns This return true if success, else false
 */
export const updateTableState = async (tableId, state) => {
  await db.tables.update({ uniqueTableId: tableId }, { state });
  global.TABLECONTROLLER.updateTable(tableId, { state });
};

/**
 * @function updateTableGameEnd
 * @description Update the gameEnd of the table into DB
 * @param {Number} tableId The unique ID of the table
 * @param {Number} gameEnd The actual time of gameEnd
 * @param {Number} state The current state of the round 0=>Betting close, 1=>Betting Open
 * @returns This return true if success, else false
 */
export const updateTableGameEnd = async (tableId, gameEnd , state) => {
  await db.tables.update({ uniqueTableId: tableId }, { gameEnd , state });
  global.TABLECONTROLLER.updateTable(tableId, { gameEnd , state});
};

/**
 * @function checkTableStatus
 * @description This checks the status if the table was closed by the admin.
 * @param {Object} io Socket connection
 * @param {Number} tableId The unique ID of the table
 * @returns This return true if success, else false
 */
export const checkTableStatus = async (io, tableId) => {
  const { status, uniqueTableId, room } = global.TABLECONTROLLER.getTable(tableId);
  // This means table is closed
  if (!status) {
    // Kick the player to the room
    io.to(room).emit('game error', 'table close');
    // Destroy all the sessions via socket per room
    destroySessionsPerRoom(io, room);
    // Remove all the player sessions!
    await db.playerSessions.remove({ tableId: uniqueTableId }, true);
    return false;
  }
  return true;
};

/**
 * @function destroySessionsPerRoom
 * @description It destroy all of the session from the socket per table/room
 * @param {Object} io Socket connection
 * @param {String} room Room name of the joined socket
 * @returns null
 */
export const destroySessionsPerRoom = (io, room) => {
  io.of('/').in(room).clients((error, clients) => {
    for (const client of clients) {
      const socket = io.sockets.connected[client];
      if (socket) {
        socket.disconnect();
      }
    }
  });
};
