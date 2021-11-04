
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    _id: { type: Number },
    tableLimitName: { type: String },
    refExchangeRateId: { type: mongoose.Schema.Types.ObjectId, ref: 'exchange_rates', default: null },
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'table_limits', default: null },
    basePlatform: { type: String },
    currencyCode: { type: String },
    defaultChip: { type: Number },
    min: { type: Number },
    dragontigerMin: { type: Number },
    dragontigerMax: { type: Number },
    tieMin: { type: Number },
    tieMax: { type: Number },
    suitcolorMin: { type: Number },
    suitcolorMax: { type: Number },
    bigsmallMin: { type: Number },
    bigsmallMax: { type: Number },
    playerTableLimit: { type: String },
    status: { type: Boolean, default: false },
  }, { timestamps: true });
  const model = connection.model('table_limits', schema);
  return model;
};
