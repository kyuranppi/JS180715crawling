const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    platform: {type: String, default: 'local'},
    nickname: String,
    email: String,
    vid: Number,
});

User.statics.create=function(json){
    const req=json.response;
    const user=new this({
        vid: req.id,
        nickname: req.nickname,
        email: req.email,
        platform: 'naver'
    })
    return user.save();
}

User.statics.findOneByEmail=function(email){
    return this.findOne({
        email
    }).exec() //promise -> then을 쓰기 위함
    // http://mongoosejs.com/docs/promises.html
}

module.exports= mongoose.model("User",User);