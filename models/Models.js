/**
 * Created by Qianxiong.Zheng on 2016/5/4.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var models ={};


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
};

userSchema.methods.validPassword=function (password) {
    return bcrypt.compareSync(password,this.password);
};

var companySchema = mongoose.Schema({
    comcode: String,
    name: String,
    city: String,
    country: String,
    currency: String
});


var profitcenter = mongoose.Schema({
    profit_center: String,
    comcode: String,
    text: String,
    profit_group: String,
    lock: String
});



models.user = mongoose.model('user',userSchema);
models.company = mongoose.model('company',companySchema);
models.profitcenter = mongoose.model('profitcenter',profitcenter);

module.exports= models;
// module.exports=mongoose.model('moModels',moModels);
