import Table from './class-table';

export default class TableController {
  /**
   * @constructor the constructor of TableController
   * @param null
   */
  constructor() {
    this.tables = {};
  }

  /**
   * @function getTables
   * @description This will get all the table
   * @param null
   * @return {Array} all tables
   */
  getTables() {
    return Object.values(this.tables);
  }

  /**
   * @function getTable
   * @description This will get the specific table
   * @param {String} tableId ID of table
   * @return {Object} table object
   */
  getTable(tableId) {
    return tableId ? this.tables[tableId] : null;
  }

  /**
   * @function addTable
   * @description Add new table to the object
   * @param {Object} table The information of table
   * @return null
   */
  addTable(table) {
    if (table) {
      const newTable = new Table(table);
      this.tables[newTable.uniqueTableId] = newTable;
    }
  }

  /**
   * @function updateTable
   * @description Update table information
   * @param {Number|String} tableId The unique id of table
   * @param {Object} data The updated information of table
   * @return null
   */
  updateTable(tableId, data) {
    if (tableId && data) {
      const table = this.getTable(tableId);
      table.uniqueTableId = data.uniqueTableId !== undefined ? data.uniqueTableId : table.uniqueTableId;
      table.roundId = data.roundId !== undefined ? data.roundId : table.roundId;
      table.shoeId = data.shoeId !== undefined ? data.shoeId : table.shoeId;
      table.tableName = data.tableName !== undefined ? data.tableName : table.tableName;
      table.bettingTimer = data.bettingTimer !== undefined ? data.bettingTimer : table.bettingTimer;
      table.maxBettingTimer = data.bettingTimer !== undefined ? data.bettingTimer : table.bettingTimer;
      table.speedLogo = data.speedLogo !== undefined ? data.speedLogo : table.speedLogo;
      table.state = data.state !== undefined ? data.state : table.state;
      table.shuffleCard = data.shuffleCard !== undefined ? data.shuffleCard : table.shuffleCard;
      table.status = data.status !== undefined ? data.status : table.status;
      table.isRestart = data.isRestart !== undefined ? data.isRestart : table.isRestart;
      table.gameEnd = data.gameEnd !== undefined ? data.gameEnd : table.gameEnd;
      table.counter = data.counter !== undefined ? data.counter : table.counter;
    }
  }

  /**
   * @function removeTable
   * @description This will remove the table from storage
   * @param {String} tableId table to be remove
   * @return null
   */
  removeTable(tableId) {
    delete this.tables[tableId];
  }

  /**
   * @function updateRoundId
   * @description This will update the round ID
   * @param {String} tableId ID of the table
   * @param {Number} roundId Current round ID
   * @return null
   */
  updateForTesting(tableId, forTesting) {
    const table = this.getTable(tableId);
    table.forTesting = forTesting;
  }

  /**
 * @function clearTick
 * @description Handles the removing of intervals
 * @param {String} tableId ID of the table
 * @param {String} name name of the ticker
 * @return null
 */
  clearTick(tableId, name) {
    const { tick } = this.getTable(tableId);
    clearInterval(tick[name]);
    tick[name] = null;
  }

  /**
   * @function shuffleCard
   * @description This will shuffle the cards
   * @param {String} tableId ID of the table
   * @return This return an array of shuffled cards
   */
  async shuffleCard(tableId) {
    const table = this.getTable(tableId);
    return table.shuffle();
  }

  /**
  * @function haveYellowCard
  * @description This will check if yellow card is existing.
  * @param {String} tableId ID of the table
  * @return true if yellow card found else false
  */
  haveYellowCard(tableId) {
    const table = this.getTable(tableId);
    return table.isShuffle();
  }

  /**
* @function burnCards
* @description It will burn/remove the card from the shuffleCard 
* @param {String} tableId ID of the table
* @param {Number} cardToBurn Total cards to be burn
* @return This will return the updated shoe cards
*/
  burnCards(tableId, cardToBurn) {
    const table = this.getTable(tableId);
    return table.burn(cardToBurn);
  }

  /**
 * @function getRoundCardResult
 * @description This will get the result of cards for the current round
 * @param {String} tableId ID of the table
 * @return Returns an array of result cards
 */
  getRoundCardResult(tableId) {
    const table = this.getTable(tableId);
    return table.getRoundResult();
  }
}
