
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    _id: { type: String },
    description: { type: String },
    seq: { type: Number },
  });
  const model = connection.model('svy_counters', schema);
  return model;
};
