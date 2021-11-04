/* eslint-disable no-nested-ternary */
import functions, { logger } from '../../functions';
import db from '../db';
import constShoe from '../../constants/constant-shoe';
import {
  createGameReport, burnCards, updatePlayerState, generateRoadMap,
  updateTableState, checkTableStatus, showResultSBO, updateTableGameEnd
} from './game-utils';
import { getPlayersOnTable, sellBet } from '../../../sockets/socket-utils';
import configs from '../../../configs';

/**
 * @function startGame
 * @description This function will start the game
 * @param {Object} param This object requires the IO and TableObj  
 * @returns null
 */
export const startGame = async ({ io, tableObj }) => {
  const { uniqueTableId, room, shoeId , tableName} = tableObj;
  if (tableObj.forTesting) {
    global.TABLECONTROLLER.updateForTesting(uniqueTableId, false);
    const shoeInc = shoeId + 1;
    await db.tables.update({ uniqueTableId }, { shuffleCard: constShoe[tableObj.testCase], shoeId: shoeInc });
    global.TABLECONTROLLER.updateTable(uniqueTableId, { shuffleCard: constShoe[tableObj.testCase], shoeId: shoeInc });
  }

  // Check if yellow card is existing in the shuffle card
  const haveYellow = global.TABLECONTROLLER.haveYellowCard(uniqueTableId);
  if (haveYellow === false) {
    // This will return a newly shuffled card.
    const shuffleCard = await global.TABLECONTROLLER.shuffleCard(uniqueTableId);
    const shoeInc = shoeId + 1;
    await db.tables.update({ uniqueTableId }, { shuffleCard, shoeId: shoeInc , counter : 0});
    global.TABLECONTROLLER.updateTable(uniqueTableId, { shoeId: shoeInc , couter: 0 });
    // Tell the client to shuffle the cards!
    io.to(room).emit('shuffle cards');

    // Update the table state to 3 => SHUFFLING
    await updateTableState(uniqueTableId, 3);

    logger.INFO({ msg: 'Card is shuffling!' }, '[GAME] => SHUFFLING CARDS', 'game-main.js');
    setTimeout(async () => {
      let firstBurnCard = shuffleCard[0];
      if(firstBurnCard === undefined){
        logger.NOTICE({ msg: 'firstBurnCard get undefined.', firstBurnCard : firstBurnCard , uniqueTableId : uniqueTableId }, '[GAME] => FIRST BURN CARD', 'game-main.js');
        firstBurnCard = await global.TABLECONTROLLER.getTable(uniqueTableId).shuffleCard[0];
        logger.NOTICE({ msg: 'get firstBurnCard in table', firstBurnCard : firstBurnCard , uniqueTableId : uniqueTableId }, '[GAME] => GET FIRST BURN CARD', 'game-main.js');
      }
      // Send to client the first card to draw
      logger.INFO({ msg: 'FIRST BURN CARD!' , firstBurnCard : firstBurnCard }, '[GAME] => FIRST BURN CARD', 'game-main.js');
      io.to(room).emit('first card', firstBurnCard);
      await db.tables.update({ uniqueTableId }, { counter : 0 })
      
      // Get the number in the cards for burning.
      const totalBurnOut = firstBurnCard.split('')[0] === 'A' ? 1 :
        firstBurnCard.split('')[0] === 'J' ? 11 :
          firstBurnCard.split('')[0] === 'Q' ? 12 :
            firstBurnCard.split('')[0] === 'K' ? 13 :
              Number(firstBurnCard.replace(/\D/g, ''));
      logger.INFO({ msg: 'Burning initial cards.', totalBurnOut, firstBurnCard }, '[GAME] => BURNING INITIAL CARDS', 'game-main.js');
      // remove the cards (+1 to include the 1st card)
      await burnCards(uniqueTableId, totalBurnOut + 1);

      setTimeout(async () => {
        logger.DEBUG({ msg: 'Start new round!', tableId: tableObj.uniqueTableId }, '[GAME] => NEW ROUND', 'game-main.js');
        // Start the round!
        await db.tableChips.remove({ tableId: uniqueTableId, shoeId }, true);
        await startRound({ io, tableObj, firstBurnCard });
      }, (totalBurnOut * 200) + 1810);
    }, 4300);
  } else {
    setTimeout(async () => {
      // Start the round
      await startRound({ io, tableObj });
    }, 1200);
  }
};

/**
 * @function startRound
 * @description This function will start the round
 * @param {Object} param This object requires the IO and TableObj  
 * @returns null
 */
const startRound = async ({ io, tableObj, firstBurnCard }) => {
  // Initialize all variables that is not changing
  const { uniqueTableId, shoeId, room, tick, maxBettingTimer} = tableObj;
  let { bettingTimer } = tableObj;

  logger.DEBUG({ msg: 'Start round!', tableID: tableObj.uniqueTableId }, '[GAME] => START ROUND', 'game-main.js');
  io.to(room).emit('start new round');

  // Increment all the player idle counter 
  // This will decrement when player bet on this round
  await db.playerSessions.updateIdleCounter({ tableId: uniqueTableId, idleCounter: { $lt: 7 } }, { $inc: { idleCounter: 1 } }, true);

  if (!tableObj.isRestart) {
    // Update the roundId of in DB 
    const newTable = await db.tables.increment({ uniqueTableId }, { $inc: { roundId: 1  , counter : 1} });
    // Update the table information
    global.TABLECONTROLLER.updateTable(uniqueTableId, newTable);

    // Create Game Report NOTE** make sure the table class is updated first!
    await createGameReport(uniqueTableId, firstBurnCard);
  } else {
    bettingTimer = Math.floor((tableObj.gameEnd.getTime() - new Date().getTime()) / 1000);
  }

  // The purpose of this is to make the game not specified as restart,
  // and to execute incrementing roundId and create game report
  global.TABLECONTROLLER.updateTable(uniqueTableId, { isRestart: false });

  // Update the table state to 1 => BETTING IS OPEN
  await updateTableState(uniqueTableId, 1);
  io.to(room).emit('table state' , { tableName: tableObj.tableName , maxPlayer : configs.main.maxPlayerPerTable , state : tableObj.state})
  // Get all the current bets on the table
  const tableChips = await functions.db.tableChips.find({ tableId: tableObj.uniqueTableId, roundId: tableObj.roundId }, 'chips -_id');
  io.to(room).emit('table chips', tableChips);

  logger.INFO(
    { msg: 'Betting start!', tableID: tableObj.uniqueTableId, roundId: tableObj.roundId, bettingTimer },
    '[GAME] => BETTING START',
    'game-main.js'
  );
  
  io.to(room).emit('new game round', {roundId : tableObj.uniqueRoundId , counter : tableObj.counter});

  setTimeout(async () => {
    // It will update the player state to STAND.
    await updatePlayerState(uniqueTableId);
    const playerList = await getPlayersOnTable(uniqueTableId);
    io.to(room).emit('player list', playerList);
  }, 1000);
  let cardResult = [];
  
  tick.betInterval = setInterval(async () => {
    if(global.CHECKDB){
      if(bettingTimer === 0){
        // Update the table state to 0 => DEALING && update the realtime when gameEnd
        await updateTableGameEnd(uniqueTableId, new Date(new Date().getTime()) , 0)
  
      }
      if(bettingTimer === -1){
  
        // Get the result for the round;
        cardResult = await global.TABLECONTROLLER.getRoundCardResult(uniqueTableId);
        // Query for player bet
        const playerBetQuery = { tableId : uniqueTableId , roundId : tableObj.uniqueRoundId};
        // Find the player bet to DB
        const playerBet = await functions.db.playerBets.find(playerBetQuery, "", true);
        console.time('sellbet speed');
        let count = 0;
        let startTime = new Date().getTime();
        if(playerBet){
          for(const item of playerBet){
            const { player , clientSocket, transId , bets , tableLimitName} = item;
            // get the total stake in playerbets
            const totalStake = bets.reduce((prev , cur) =>  prev + cur.stake , 0);
  
            const playerBetQuery = { tableId : uniqueTableId , roundId : tableObj.uniqueRoundId , transId : transId }
            sellBet(io, clientSocket, player, tableObj, totalStake, transId , playerBetQuery, bets , cardResult , tableLimitName);
            
            count++;
          }
        }
        console.timeEnd('sellbet speed');
        // get all speed of sellbet
        if(count === playerBet.length){
          let endTime = new Date().getTime();
          logger.INFO(
            { msg: 'SPEED RESULT' ,  startTime : startTime, endTime : endTime , 
            totalSpeed : endTime - startTime , tableId : uniqueTableId , 
            roundId : tableObj.uniqueRoundId , countPlayerBets : playerBet.length},
            '[GAME] => SPEED RESULT',
            'game-main.js'
          );
        }
      }
      if (bettingTimer < -6) {
        // clear the bet tick interval
        await global.TABLECONTROLLER.clearTick(uniqueTableId, 'betInterval');
        cardResult = await global.TABLECONTROLLER.getRoundCardResult(uniqueTableId);
  
        logger.INFO(
          { msg: 'Betting end!', tableID: tableObj.uniqueTableId, roundId: tableObj.roundId, bettingTimer },
          '[GAME] => BETTING END',
          'game-main.js'
        );
        // Filter the result to send into the client
        const filterCardResult = { ...cardResult };
        
        filterCardResult.burnout = '';
  
        // Send to draw the cards for animation purpose
        io.to(room).emit('draw card', filterCardResult);
        // const evaluatedResult = evaluateMatchResult(uniqueTableId, cardResult);
  
        // remove the cards (+1 to include the 1st card)
        await burnCards(uniqueTableId, Object.keys(cardResult).length);
  
        setTimeout(async () => {
          const evaluatedResult = showResultSBO(uniqueTableId, cardResult);
          const { playerBets, gameResult } = await evaluatedResult;
          // Update the game report
          await db.gameReports.update({ roundId: tableObj.uniqueRoundId }, { gameResult, cardResult, roadmap: gameResult[0] , status : 4});
  
          logger.INFO(
            { msg: 'Round result!', tableID: tableObj.uniqueTableId, roundId: tableObj.roundId, cardResult, gameResult },
            '[GAME] => ROUND RESULT',
            'game-main.js'
          );
  
          // Send the round result to the client
          io.to(room).emit('round result', { playerBets, gameResult });
          // Generate the road map
          const roadMap = await generateRoadMap(uniqueTableId, shoeId);
          io.to(room).emit('road map', roadMap);
  
          setTimeout(async () => {
            const isOpen = await checkTableStatus(io, uniqueTableId);
            io.to(room).emit('update table limit');
            if (isOpen) {
              // start round
              startGame({ io, tableObj });
            } else {
              logger.INFO({ msg: 'Table is closed!', tableID: tableObj.uniqueTableId }, '[GAME] => TABLE CLOSED!', 'game-main.js');
              // Update the table state to 1 => TABLE WAS CLOSE/DISABLE
              await updateTableState(uniqueTableId, 2);
            }
          }, 6500);
        }, 7200);
      }
      if (bettingTimer >= 0) io.to(room).emit('bet tick', { curr: bettingTimer, max: maxBettingTimer });
      bettingTimer--;
    }
  }, 1000);
};

