import general from '../functions/general';
import CardHandler from './class-card-handler';
/**
 * @class RouteChanger
 * @description This class will provide all the information of the table
 */
export default class TableInformation extends CardHandler {
  /**
   * @constructor This is the constructor of the table
   * @param {Object} data Information of table needed
   */
  constructor(data) {
    super();
    this._id = data._id;
    this._tableName = data.tableName;
    this._uniqueTableId = data.uniqueTableId;
    this._roundId = data.roundId;
    this._shoeId = data.shoeId;
    this._bettingTimer = data.bettingTimer;
    this._maxBettingTimer = data.bettingTimer;
    this._speedLogo = data.speedLogo;
    this._state = data.state;
    this._shuffleCard = data.shuffleCard || [];
    this._status = data.status;
    this._gameEnd = data.gameEnd;
    // Game
    this._tick = { betInterval: null };
    this._isRestart = false;
    // Testing
    this._forTesting = false;
    this._testCase = 1;
    // added for sbo disable side bet
    this._counter = data.counter;
  }

  /**
   * @function shuffle
   * @description This will shuffle the cards using certified RNG
   * @returns {Array} Returns an array of shuffle cards
   */
  async shuffle() {
    this._shuffleCard = await this.shuffleCards();
    return this._shuffleCard;
  }

  /**
  * @function isShuffle
  * @description This will check if yellow card is existing.
  * @return true if yellow card found else false
  */
  isShuffle() {
    return this.haveYellowCard(this._shuffleCard);
  }

  /**
   * @function burnCards
   * @description It will burn/remove the card from the shuffleCard 
   * @param {Number} cardToBurn Total cards to be burn
   * @return This will return the updated shoe cards
   */
  burn(cardToBurn) {
    return this.burnCards(cardToBurn, this._shuffleCard);
  }

  /**
   * @function getRoundResult
   * @description This will get the result of cards for the current round
   * @return Returns an array of result cards
   */
  getRoundResult() {
    return this.getRoundCardResult(this._shuffleCard);
  }

  /** GETTER SETTER [tick] */
  get tick() {
    return this._tick;
  }

  get testCase() {
    return this._testCase;
  }

  get maxBettingTimer() {
    return this._maxBettingTimer;
  }
  set maxBettingTimer(maxBettingTimer) {
    this._maxBettingTimer = maxBettingTimer;
  }
  /** GETTER SETTER [forTesting] */
  get forTesting() {
    return this._forTesting;
  }
  set forTesting(forTesting) {
    this._forTesting = forTesting;
  }

  /** GETTER SETTER [isRestart] */
  get isRestart() {
    return this._isRestart;
  }
  set isRestart(isRestart) {
    this._isRestart = isRestart;
  }

  /** GETTER SETTER [gameEnd] */
  get gameEnd() {
    return this._gameEnd;
  }
  set gameEnd(gameEnd) {
    this._gameEnd = gameEnd;
  }

  /** GETTER SETTER [uniqueTableId] */
  get uniqueTableId() {
    return this._uniqueTableId;
  }
  set uniqueTableId(uniqueTableId) {
    this._uniqueTableId = uniqueTableId;
  }

  /** GETTER SETTER [tableName] */
  get tableName() {
    return this._tableName;
  }
  set tableName(tableName) {
    this._tableName = tableName;
  }

  /** GETTER SETTER [roundId] */
  get roundId() {
    return this._roundId;
  }
  set roundId(roundId) {
    this._roundId = roundId;
  }

  /** GETTER SETTER [shoeId] */
  get shoeId() {
    return this._shoeId;
  }
  set shoeId(shoeId) {
    this._shoeId = shoeId;
  }

  /** GETTER SETTER [bettingTimer] */
  get bettingTimer() {
    return this._bettingTimer;
  }

  set bettingTimer(bettingTimer) {
    this._bettingTimer = bettingTimer;
  }

  /** GETTER SETTER [speedLogo] */
  get speedLogo() {
    return this._speedLogo;
  }

  set speedLogo(speedLogo) {
    this._speedLogo = speedLogo;
  }

  /** GETTER SETTER [state] */
  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
  }

  /** GETTER SETTER [shuffleCard] */
  get shuffleCard() {
    return this._shuffleCard;
  }

  set shuffleCard(shuffleCard) {
    this._shuffleCard = shuffleCard;
  }

  /** GETTER SETTER [status] */
  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
  }

  /** GETTER [uniqueRoundId] */
  get uniqueRoundId() {
    return general.variable.generateRoundId(this._roundId, this._uniqueTableId);
  }

  /** GETTER SETTER [room] */
  get room() {
    return this.uniqueTableId;
  }

  /** GETTER SETTER [counter] */
  get counter() {
    return this._counter;
  }
  set counter(counter) {
    this._counter = counter;
  }
  

  /**
   * @function information
   * @description This function will get the table information
   */
  get information() {
    return {
      id: this._id,
      uniqueTableId: this.uniqueTableId,
      roundId: this.roundId,
      shoeId: this.shoeId,
      tableName: this.tableName,
      bettingTimer: this.bettingTimer,
      speedLogo: this.speedLogo,
      state: this.state,
      shuffleCard: this.shuffleCard,
      status: this.status,
      counter : this.counter,
    };
  }
}
