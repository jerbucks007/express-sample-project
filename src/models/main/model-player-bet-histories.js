
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    gameStart: { type: Date },
    rebet: { type: Boolean },
    tableId: { type: Number },
    tableName: { type: String },
    transId: { type: String },
    transExtId: { type: Number }, // ( from SBO if not same as transId )
    roundId: { type: Number },
    pos: { type: Number },
    player: {
      _id: { type: String },
      userId: { type: String },
      username: { type: String },
      displayname: { type: String },
      clientId: { type: String },
      sessionId: { type: String },
      isMobile: { type: Boolean },
      basePlatform: { type: String },
      currency: { type: String },
      tableLimit: { type: String },
      isWalkin: { type: Boolean },
      lang: { type: String },
      device: { type: String },
      httpreff: { type: String },
      betSettings: { type: Object }, // ( from SBO/Onyx settings if have )
      ip: { type: String },
      isTestAccount : {type : Boolean},
      playerIp : { type: String },
      gameCode : { type: String },
    },
    totalPayout: { type: Number }, // (total winloss)
    totalAmount: { type: Number }, // (total stake)
    totalEffectiveStake: { type: Number }, // (total stake)
    win: { type: Boolean }, // ( if Payment is greater than amount )
    bets: [{
      _id: false,
      subBetId: { type: Number }, // ( ID of the betting options)
      code: { type: String }, // ( betOption code from GAME )
      stake: { type: Number }, // ( will total all of the bet on the option )
      effectiveStake: {type : Number}, // ( will total all of the bet on the option divide by 2 if Tie)
      winloss: { type: Number }, // ( stake + winning amount )
      win: { type: Boolean }, // ( if win on the bet )
      txnDate: { type: Date }, // ( Date when transaction made )
    }],
    gameEnd: { type: Date },
    status: { type: Number, default: 0 }, // 0=>Pending, 1=>Running, 2=>Failed, 3=>after evaluate ,4=>finish success resultbet, 6=>Abort, 7=>Void
  }, { timestamps: true });
  const model = connection.model('player_bet_histories', schema);
  return model;
};

