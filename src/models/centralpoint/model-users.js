
export default (mongoose, connection) => {
  const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    displayname: { type: String, default: '' },
    avatar: { type: String, default: 'default.jpg' },
    _sid: { type: Object, default: {} },
    hash: { type: String },
    salt: { type: String },
    token: { type: String },
    chips: { type: Number, default: 0 },
    currency: { type: String, uppercase: true },
    oddsType: { type: Number, default: 0 },
    since: { type: Date, default: () => new Date() },
    lastLogin: { type: Date, default: () => new Date() },
    base_platform: { type: String },
    platform: { type: String },
    isBot: { type: Boolean },

    // onyx
    is_walkin: { type: Boolean, default: true },
    client_id: { type: String },
    listDoCashBackHandleToOnyx: { type: Array },
  });
  const model = connection.model('users', userSchema);
  return model;
};
