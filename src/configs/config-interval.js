
export default {
  // 60,000 = 1 minute, this will ensure the expiration of token
  tokenTTL: 5 * 60000,
  // 60 = 1 minute, this will ensure the expiration of session (server side)
  sessionMaxAge: 15 * 60,
  // 60,000 = 1 minute, this is for the expiaration of cookie
  cookieMaxAge: 15 * 60000,
  // Max limit for idling of players on table
  idleLimit: 5,
  // 60,000 = 1 minute, this is for acceptance return back after user disconnected
  disconnectAccept: 30 * 60000,
  // // 1000 = 1 seconds, this is for the main app interval broadcast
  // broadcastInterval: 5 * 1000,
  // // 1000= 1seconds, this is for the app to check the idle player
  // idleInterval: 5 * 1000,
  // // 1000= 1seconds, this is for the app to check the request balance interval
  // requestBalanceInterval: 30 * 1000,
  // // 60,000 = 1 minute, this is the max time for rbt to determine if IO
  // rbtMaxTime: 15 * 60000,
};
