
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    name: { type: String }, // (ex.Dragon, Tie)
    code: { type: String }, // (ex.DRG, TIE)
    multiplier: { type: Number }, // (ex. 1, 8)
  });
  const model = connection.model('game_type_options ', schema);
  return model;
};

