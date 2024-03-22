const mongoose=require("mongoose");
const passwordLocalMongoose=require("passport-local-mongoose");
const UserSchema=new mongoose.Schema({
    username:String,
    password:String, // not need to define as the passport-local-mongoose will do it for us 
    email:String,
});
UserSchema.plugin(passwordLocalMongoose);
module.exports= mongoose.model("User",UserSchema);