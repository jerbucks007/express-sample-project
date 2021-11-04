
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    token: { type: String },
    psid: { type: String },
    table: { type: String },
    server: { type: String, default: 'table' },
    expiration: { type: Number },
  });
  const model = connection.model('game_tokens', schema);
  return model;
};
