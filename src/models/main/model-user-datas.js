
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    userId: { type: String },
    displayname: { type: String },
    avatar: { type: String },
  }, { timestamps: true });

  const model = connection.model('user_datas', schema);
  return model;
};
