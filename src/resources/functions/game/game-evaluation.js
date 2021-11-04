/* eslint-disable no-nested-ternary */

/**
 * @function evaluateCardResult
 * @description This function will generate the result for (DRAGON | TIGER)
 * @param {String} dragon The result of the round (DRAGON)
 * @param {String} tiger  The result of the round (TIGER)
 * @return {Array} This returns an array of result
 */
export const evaluateCardResult = (dragon, tiger) => {
  if (!dragon || !tiger) return new Error('Invalid input!');

  const result = [];
  const dragonNum = dragon[0] === 'A' ? 1 :
    dragon[0] === 'J' ? 11 :
      dragon[0] === 'Q' ? 12 :
        dragon[0] === 'K' ? 13 :
          Number(dragon.replace(/\D/g, ''));

  const tigerNum = tiger[0] === 'A' ? 1 :
    tiger[0] === 'J' ? 11 :
      tiger[0] === 'Q' ? 12 :
        tiger[0] === 'K' ? 13 :
          Number(tiger.replace(/\D/g, ''));

  const dragonStr = dragon[dragon.length - 1];
  const tigerStr = tiger[tiger.length - 1];

  const winner = (dragonNum === tigerNum) ? 'TIE' : (dragonNum > tigerNum) ? 'DRG' : 'TGR';

  // Push to array the winner for result
  result.push(winner);

  // Check if dragon number is not in between (7)
  if (dragonNum !== 7) {
    // Get the result for big and small
    const dragonSmallBlack = dragonNum <= 6 ? 'SML' : dragonNum >= 8 ? 'BIG' : '';
    result.push(`DRG${dragonSmallBlack}`);

    // Get the result for red and black
    const dragonRedBlack = (dragonStr === 'D' || dragonStr === 'H') ? 'RED' : 'BLK';
    result.push(`DRG${dragonRedBlack}`);
  }

  // Check if tgier number is not in between (7)
  if (tigerNum !== 7) {
    // Get the result for big and small
    const tigerSmallBlack = tigerNum <= 6 ? 'SML' : tigerNum >= 8 ? 'BIG' : '';
    result.push(`TGR${tigerSmallBlack}`);

    // Get the result for red and black
    const tigerRedBlack = (tigerStr === 'D' || tigerStr === 'H') ? 'RED' : 'BLK';
    result.push(`TGR${tigerRedBlack}`);
  }
  return result;
};

/**
 * @function evaluatePlayerBets
 * @description This function will evaluate the bets of the players
 * @param {Array} roundResult The result of the round
 * @param {Array} playerBets  An array of player bets
 * @return {Array} This returns an array of evaluated player bets
 */
export const evaluatePlayerBets = (roundResult, playerBets) => playerBets.map(bet => {
  const betObj = bet;
  betObj.effectiveStake = betObj.stake;
  // Check if round is tie and if player have bet on DRG || TGR return the 0.5 (half) of the bet
  if (roundResult.includes('TIE') && (betObj.code === 'DRG' || betObj.code === 'TGR')) {
    betObj.winloss = (betObj.stake * 0.5);
    betObj.effectiveStake = (betObj.stake * 0.5);
  }
  // Check the bet if is win 
  const isWin = roundResult.includes(betObj.code);
  betObj.win = isWin;
  if (isWin) {
    // Check if code is TIE => multiplier will be x9, else x2
    const multiplier = betObj.code === 'TIE' ? 9 : 2;
    betObj.winloss = (betObj.stake * multiplier);
  }
  return betObj;
});
