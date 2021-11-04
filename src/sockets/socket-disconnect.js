
export default ({ socket, session }) => {
  socket.on('disconnect', async () => {
    console.log('user is disconnected!', session.playerSession.refActiveUser.displayname);
    socket.emit('disconnected');
  });
};
