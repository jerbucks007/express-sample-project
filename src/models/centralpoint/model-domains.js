
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    type: { type: Number },
    env: { type: String },
    site: { type: String },
  });

  const model = connection.model('domains', schema);
  return model;
};
