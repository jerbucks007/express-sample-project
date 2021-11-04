
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    _id: { type: String },
    desc: { type: String },
    seq: { type: Number },
  });
  const model = connection.model('counters', schema);
  return model;
};
