
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    tableId: { type: Number },
    roundId: { type: Number },
    shoeId: { type: Number },
    chips: [{
      _id: false,
      player: { type: String },
      code: { type: String },
      destination: { type: Object },
      amount: { type: Number },
      exchangeRate: { type: Number },
    }],
  }, { timestamps: true });
  const model = connection.model('table_chips', schema);
  return model;
};

