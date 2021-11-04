
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    tableId: { type: Number },
    pos: { type: Number },
    state: { type: Number }, // 0=>playing, 1=>table limit closed, 2=>terminate/boot
    idleCounter: { type: Number },
    token: { type: String },
    tableLimit: { type: Object },
    exchangeRate: { type: Object },
    refActiveUser: { type: 'ObjectId', ref: 'active_users' },
    activeOn: { type: Date, default: () => new Date() },
    balance: { type: Number },
  }, { timestamps: true });
  const model = connection.model('player_sessions', schema);
  return model;
};
