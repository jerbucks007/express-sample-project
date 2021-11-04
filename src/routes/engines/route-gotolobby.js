
import functions from '../../resources/functions';
import configs from '../../configs';
// import routeAsyncHandler from '../middlewares/route-async-handler';

export default (app) => {
  app.post('/gotoLobby', async (req, res) => {
    const host = req.get('Host');
    const lobbyToken = functions.general.object.encryptObject({ token: new Date().getTime() + 30000 }, true);
    if (!req.session.playerSession) {
      return res.send({ url: configs.main.getLobbyAddress(host, lobbyToken), error: false });
    }
    const { tableId, refActiveUser } = req.session.playerSession;
    const { uniqueTableId, uniqueRoundId, status } = global.TABLECONTROLLER.getTable(tableId);
    if (!uniqueTableId) return false;

    // Query for player bet
    const playerBetQuery = { roundId: uniqueRoundId, 'player.userId': refActiveUser.userId };
    // Find the player bet to DB
    const playerBet = await functions.db.playerBets.find(playerBetQuery);

    // If have player bet return error so it will not redirect to lobby
    if (playerBet && status) return res.send({ url: '', error: true });

    // Remove the player from player session
    await functions.db.playerSessions.remove({ refActiveUser: req.session.playerSession.refActiveUser._id }, true);
    // Remove the player token from DB
    await functions.db.gameTokens.remove({ psid: req.session.playerSession._id, table: req.session.playerSession.tableId }, true);

    // Get the address of lobby and redirect
    return res.send({ url: configs.main.getLobbyAddress(host, lobbyToken), error: false });
  });
};
