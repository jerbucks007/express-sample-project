
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    refTableId: { type: mongoose.Schema.Types.ObjectId, ref: 'tables' },
    currencyCode: { type: String },
    refTableLimitId: { type: mongoose.Schema.Types.ObjectId, ref: 'table_limits' },
  }, { timestamps: true });
  const model = connection.model('table_limit_relations', schema);
  return model;
};

