import socketIo from 'socket.io';
import expressSocketIoSession from 'express-socket.io-session';
import configs from '../configs';
import sockets from '../sockets';

export default async ({ server, expressSession, cookieParser, sessionStore }) => {
  const io = socketIo.listen(server, { path: `${configs.express.apiPrefix}/socket.io` });

  io.set('transports', configs.express.io_transports);
  io.set('heartbeat interval', configs.express.io_heartbeat_interval);
  io.set('heartbeat timeout', configs.express.io_heartbeat_timeout);
  io.use(expressSocketIoSession(expressSession, cookieParser, configs.express.io_shared_session));
  io.use((socket, next) => {
    const data = socket.request;
    const ckie = `${configs.main.EXPRESS_SID_KEY}=`;
    const tempCkie = socket.handshake.headers.cookie || socket.handshake.query.cookie;
    if (!data.headers.cookie && tempCkie === undefined) {
      // Functions.log.ERROR({ error: 'no cookie transmitted', cookieHeader: data.headers.cookie, tempCookie: tempCkie }, 'socket.io error', 'app.js');
      io.to(socket.id).emit('socket_error', 'No cookie transmitted');
      next(new Error('No cookie transmitted'));
    } else if (!data.headers.cookie && tempCkie !== undefined) {
      data.headers.cookie = ckie + tempCkie;
    }

    cookieParser(data, {}, (parseErr) => {
      if (parseErr) {
        // Functions.log.ERROR({ error: 'error parsing cookie', data: data, err: parseErr }, 'socket.io error', 'app.js');
        io.to(socket.id).emit('socket_error', 'Error parsing cookies');
        next(new Error('Error parsing cookies'));
      }
      const sidCookie = (data.secureCookies && data.secureCookies[`${configs.main.EXPRESS_SID_KEY}`]) ||
        (data.signedCookies && data.signedCookies[`${configs.main.EXPRESS_SID_KEY}`]) ||
        (data.cookies && data.cookies[`${configs.main.EXPRESS_SID_KEY}`]);

      sessionStore.load(sidCookie, (err, session) => {
        if (err || !session || !session.playerSession) {
          // Functions.log.ERROR({ error: 'no session', sidCookie: sidCookie, err: err }, 'socket.io error', 'app.js');
          io.to(socket.id).emit('socket_error', 'No session');
          next(new Error('no session!'));
        } else {
          data.session = session;
          next();
        }
      });
    });
  });

  // Modules for sockets
  sockets(io);

  return io;
};
