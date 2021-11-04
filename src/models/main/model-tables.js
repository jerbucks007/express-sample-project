
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    uniqueTableId: { type: Number },
    basePlatform: { type: String },
    roundId: { type: Number },
    shoeId: { type: Number },
    tableName: { type: String },
    bettingTimer: { type: Number },
    speedLogo: { type: Boolean },
    state: { type: Number }, // (0=Dealing, 1=Betting Open, 2=Closed, 3=Shuffling )
    shuffleCard: { type: Array }, // (contains suffled cards including yellow card location in the array)
    status: { type: Boolean, default: false }, 
    gameEnd: { type: Date },
    counter : {type : Number}, // added for disable side bet
  }, { timestamps: true });
  const model = connection.model('tables', schema);
  return model;
};
