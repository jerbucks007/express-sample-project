
export default (mongoose, connection) => {
  const schema = new mongoose.Schema({
    currencyCode: { type: String }, // (Currency Code)
    name: { type: String }, // (Currency Name)
    value: { type: Number }, // (Currency Exchange Rate)
    histories: [{
      _id: mongoose.Schema.Types.ObjectId,
      dateModified: { type: Date }, // (date change)
      value: { type: Number }, // ( old value )
    }], // (incase wants to record changes in exchange rate can put in histories)
  });
  const model = connection.model('exchange_rates', schema);
  return model;
};

