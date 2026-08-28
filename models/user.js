const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose =require("passport-local-mongoose");

//  Creating Schema

const userSchema = new Schema({
    email:{
        type:String,
        required :true
    },
});


// plugin used to generate automatically username and passworad

// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model("User",userSchema);