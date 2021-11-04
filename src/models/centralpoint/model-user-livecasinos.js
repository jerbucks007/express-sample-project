export default (mongoose, connection) => {
    const schema = new mongoose.Schema({ 
        GameCode : {type : String},
        UserName : {type : String},
        PlayerId : {type : String},
        Currency : {type : String},
        Language : {type : String},
        PlayerIp : {type : String},
        SessionId : {type : String},
        IsTestAccount : {type : Boolean},
        Token : {type : String},
        chips : {type : Number},
    });
    const model = connection.model('user_livecasinos', schema);
    return model;
  };