
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    _id: { type: String },
    session: { type: String },
    expires: { type: Date },
  });
  const model = connection.model('sessions', schema);
  return model;
};
