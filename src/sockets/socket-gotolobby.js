import { getPlayersOnTable } from './socket-utils';

export default ({ io, socket }) => {
  socket.on('gotolobby', async (room) => {
    const playerList = await getPlayersOnTable(room);
    io.to(room).emit('player list', playerList);
  });
};
