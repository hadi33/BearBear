/**
 * Created by Qianxiong.Zheng on 2016/5/4.
 */
var mongoose = require('mongoose');
var Q = require('q');

var db = {};
db.url = 'mongodb://127.0.0.1/bearBear';

db.connectDB = function () {
    mongoose.connect(db.url, function (err) {
        if (err) throw err;

    });
};

db.disconnectDB = function () {
    mongoose.disconnect();
};


module.exports = db;
