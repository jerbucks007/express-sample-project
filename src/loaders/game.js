import functions from '../resources/functions';
import configs from '../configs';

export default async ({ io }) => {
  const tables = await functions.db.tables.find({ basePlatform: global.HOUSE, serverId: configs.main.serverId }, '', true);
  
  // const tables = await functions.db.tables.find({ basePlatform: global.HOUSE }, '', true);
  if (tables && tables.length > 0) {
    for (const item of tables) {
      // Add the table to the controller
      global.TABLECONTROLLER.addTable(item);
      const tableObj = global.TABLECONTROLLER.getTable(item.uniqueTableId);
      if (tableObj.status) {
        // Check if have table have game report to determine if it will restart or not.
        const isRestart = await functions.db.gameReports.count({
          roundId: tableObj.uniqueRoundId,
          tableId: tableObj.uniqueTableId,
          cardResult: { $eq: null },
        }) > 0;
        // Udpate the table isRestart property
        global.TABLECONTROLLER.updateTable(tableObj.uniqueTableId, { isRestart });
        // Start the game
        functions.game.startGame({ io, tableObj });
      }
    }
  }
};
