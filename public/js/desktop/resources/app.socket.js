class Socket {
  constructor() {
    this.config = {
      'reconnection': true,
      'reconnectionDelay': 5000,
      'reconnectionDelayMax ': Infinity,
      'secure': true,
      'autoConnect': true,
      'path': wsPath + '/socket.io',
      'transports': ['websocket'],
      'query': {}
    }
    this.host = location.host;
    console.log("wsPath >>>>>>>>>", wsPath);
    this.socket = io(this.host, this.config);
    this.socketHandler('table');
  }

  on(eventName, next) {
    this.socket.on(eventName, function() {
      var args = arguments;
      next.apply(this.socket, args);
    });
  }
  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }
  setHost(host) {
    this.host = host;
  }

  socketHandler(name) {
    const maxAttempts = 2;
    var self = this;
    this.socket.on('connect', (gameResults) => {
      console.log(`### [${name}_socket] #### connect`);
    });

    this.socket.on('reconnect', () => {
      console.log(`### [${name}_socket] #### reconnect`);
      CGameClass.restartGame(function(){
        // socket.emit("join room");
        
      });
      // socket.emit('window visibility', true);
    });

    this.socket.on('connecting', () => {
      console.log(`### [${name}_socket] #### connecting`);
    });

    this.socket.on('reconnecting', (numberAttemps) => {
      console.log(`### [${name}_socket] #### reconnecting`);
      if (numberAttemps >= maxAttempts) {
        // console.log('Reached maximum number of attempts');
      }
    });

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    this.socket.on('reconnect_attempt', () => {
      console.log(`### [${name}_socket] #### reconnect attempt`);
      socket.socket.io.opts.transports = ['websocket'];
    });

    this.socket.on('connect_failed', () => {
      console.log(`### [${name}_socket] #### connect_failed`);
    });

    this.socket.on('connect_error', () => {
      console.log(`### [${name}_socket] #### connect_error`);
    });

    this.socket.on('error', (data) => {
      console.log(`### [${name}_socket] #### error`, data);
      // self.socket.reconnect();
      self.socketHandler('table');
    });

    this.socket.on('reconnect_failed', () => {
      console.log(`### [${name}_socket] #### reconnect_failed`);
    });

    this.socket.on('close', () => {
      console.log(`### [${name}_socket] #### close`);
    });

    this.socket.on('accessDenied', () => {
      console.log(`### [${name}_socket] #### accessDenied`);
    });

    this.socket.on('disconnected', () => {
      console.log(`### [${name}_socket] #### disconnected`);
      CGameClass.removeTickers();
    });

    this.socket.on('disconnect', () => {
      console.log(`### [${name}_socket] #### disconnect`);
      CGameClass.removeTickers();
    });
  }
}



var socket = new Socket();