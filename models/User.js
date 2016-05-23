/**
 * Created by Qianxiong.Zheng on 2016/5/4.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username:String,
    password:String,
    email:String,
    role:{type: String, enum: ['User', 'Moderator', 'Admin', 'God', 'Banned', 'Unverified']},
    token:String,
    verificationToken:{type : String}
});

userSchema.methods.generateHash =function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}
userSchema.methods.validPassword=function (password) {
    return bcrypt.compareSync(password,this.password);
}

module.exports=mongoose.model('User',userSchema);