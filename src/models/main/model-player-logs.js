export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    userId: { type: String},
    gameCode : {type : String},
    username : {type : String},
    server: { type: String },
    serverId : {type : Number},
    createdAt : { type: Date, default: Date.now},
  });

  const model = connection.model('player_logs', schema);
  return model;
};