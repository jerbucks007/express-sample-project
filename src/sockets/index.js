import connection from './socket-connection';
import disconnect from './socket-disconnect';
import playerSit from './socket-player-sit';
import playerBet from './socket-player-bet';
import joinRoom from './socket-join-room';
import getMyBalance from './socket-get-my-balance';
import getMyResult from './socket-get-my-result';
import checkState from './socket-check-state';
import main from './socket-main';
import rebet from './socket-rebet';
import taunt from './socket-taunt';
import avatar from './socket-avatar';
import gotolobby from './socket-gotolobby';
import getPlayerBetHistory from './socket-player-bet-history';
import getTableLimit from './socket-get-table-limit';


export default (io) => {
  io.on('connection', socket => {
    const session = socket.request.session;
    socket.join(session.playerSession._id);

    // This will excecute when user is connected to the socket
    connection({ io, socket, session });

    // This will excecute when user is disconnected to the socket
    disconnect({ io, socket, session });

    // This is socket for joining room
    joinRoom({ io, socket, session });

    // This is the socket for main
    main({ io, socket, session });

    // This is the socket for player sit
    playerSit({ io, socket, session });

    // This is the socket for player bet
    playerBet({ io, socket, session });

    // This is the socket for player bet
    getMyResult({ io, socket, session });

    // This is the socket for checking state
    checkState({ io, socket, session });

    // This is socket for getting of player balance
    getMyBalance({ io, socket, session });

    // This is socket for player rebet
    rebet({ io, socket, session });

    // This is socket for avatar
    avatar({ io, socket, session });

    // This is socket for taunt
    taunt({ io, socket, session });

    // This is socket for taunt
    gotolobby({ io, socket, session });

    // this will execute when user click game report for SBO only
    getPlayerBetHistory({ io, socket, session });

    // This will excecute when user request update for table limit
    getTableLimit({ io, socket, session });

  });
};
