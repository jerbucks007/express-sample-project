
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    gameStart: { type: Date },
    gameEnd: { type: Date },
    roundId: { type: Number },
    shoeId: { type: Number },
    tableId: { type: Number },
    tableName: { type: String },
    status: { type: Number , default : 1}, // 1 default , 4 round is finish 
    roadmap: { type: String },
    gameResult: { type: Array },
    cardResult: { type: Object }, // (ex. {burnout: "C1", dragon: "S1", tiger: "D2"});
  }, { timestamps: true });
  const model = connection.model('game_report_histories', schema);
  return model;
};

