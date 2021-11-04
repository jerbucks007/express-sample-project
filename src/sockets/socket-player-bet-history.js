import functions from '../resources/functions';
import configs from '../configs';

export default ({ io, socket, session }) => {
  socket.on('playerbet history', async () => {
    const { userId } = session.user; 
    // Check player session if valid!
    if (!await functions.db.sessions.checkSession(session)) {
      socket.emit('server error', 'invalid session');
      return false;
    }
    const condition = {'player.userId' : userId , status : 4}
    let pbets = await functions.db.playerBets.findSortHistory(condition ,'-_id tableId roundId bets totalPayout totalAmount totalEffectiveStake gameEnd pos win transId', {createdAt : -1} , true , 10);
    if(pbets === null){
      pbets = [];
    }
    if(pbets.length < 10 ){
      const limitBy = 10 - pbets.length;
      let pbhistory = await functions.db.playerBetHistory.findSortHistory(condition ,'-_id tableId roundId bets totalPayout totalAmount totalEffectiveStake gameEnd pos win transId', {createdAt : -1} , true , limitBy);
      if(pbhistory === null){
        pbhistory = [];
      }
      for(const item of pbhistory){
        pbets.push(item)
      }
    }

    for(const item of pbets){
      const {totalPayout , totalAmount} = item;
        item.totalPayout = totalPayout - totalAmount; 
    }
    
    socket.emit('playerbet history', pbets);
  });
};