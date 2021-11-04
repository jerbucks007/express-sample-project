
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    gameStart: { type: Date },
    gameEnd: { type: Date },
    roundId: { type: Number },
    shoeId: { type: Number },
    tableId: { type: Number },
    tableName: { type: String },
    status: { type: String },
    roadmap: { type: String },
    gameResult: { type: Array },
    cardResult: { type: Object }, // (ex. {burnout: "C1", dragon: "S1", tiger: "D2"});
  }, { timestamps: true });
  const model = connection.model('game_report_prev', schema);
  return model;
};

