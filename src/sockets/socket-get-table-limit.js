import functions from '../resources/functions';

export default async ({ io, socket, session }) => {
  socket.on('table limit', async () => {
    let tableLimits = [];
    let queryTableLimit = null
    // find table limits based playerTableLimit
    switch(session.user.playerTableLimit) {
      case 'Low':
        queryTableLimit = { basePlatform: session.user.basePlatform, currencyCode: session.user.currency, status: true, playerTableLimit : 'Low' }
        break;
      case 'Medium':
        queryTableLimit = { basePlatform: session.user.basePlatform, currencyCode: session.user.currency, status: true, $or:[ {playerTableLimit : "Low" }, {playerTableLimit : "Medium" }] }
        break;
      case 'High':
        queryTableLimit = { basePlatform: session.user.basePlatform, currencyCode: session.user.currency, status: true, $or:[ {playerTableLimit : "Low" }, {playerTableLimit : "Medium" }, {playerTableLimit : "High" }] }
        break;
      case 'VIP':
        queryTableLimit = { basePlatform: session.user.basePlatform, currencyCode: session.user.currency, status: true }
        break;
      default:
        queryTableLimit = { basePlatform: session.user.basePlatform, currencyCode: session.user.currency, status: true }
    }
    tableLimits = await functions.db.tableLimits
      .find(queryTableLimit,
        '-baseId -refExchangeRateId -updatedAt -createdAt',
      true);
    

    if(tableLimits.length>0){
      //check if my limit is remove
      const selectedLimit = tableLimits.filter(limit => (limit._id === session.playerSession.tableLimit._id));
      if(selectedLimit.length > 0){
        // do nothing because my limit is active
      }else{
        socket.emit("table limit closed" , 1 );
        await functions.db.playerSessions.update({ refActiveUser: session.playerSession.refActiveUser._id}, {state : 1})
      } 
    }else{
      socket.emit("table limit closed" , 0 );
      await functions.db.playerSessions.update({ refActiveUser: session.playerSession.refActiveUser._id }, {state : 1})
    }

  });
};

