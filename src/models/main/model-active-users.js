
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    _sid: { type: String },
    userId: { type: String }, // for local only to get the info in centralpoint
    username: { type: String },
    displayname: { type: String },
    clientId: { type: String },
    sessionId: { type: String },
    tableId: { type: String },
    avatar: { type: String },
    basePlatform: { type: String },
    currency: { type: String },
    token: { type: String },
    activeOn: { type: Date },
    isWalkin: { type: Boolean },
    lang: { type: String },
    uAgent: { type: mongoose.Schema.Types.Mixed },
    device: { type: String },
    isMobile: { type: Boolean },
    httpreff: { type: String },
    ip: { type: String },
    siteId: { type: Number },
    isBot: { type: Object },
    isTestAccount : {type : Boolean },
    homeUrl : {type : String},
    playerIp : {type : String},
    gameCode : {type : String},
    loginUrl : {type : String},
    settings: {
      isMute: { type: Boolean, default: false },
    },
  }, { timestamps: true, minimize: false });
  const model = connection.model('active_users', schema);
  return model;
};
