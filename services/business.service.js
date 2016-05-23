var Q = require('q');
var mongoose = require('mongoose');
var database = require('config/db');

var company = mongoose.Schema({
    company: String,
    name: String
});

var service = {};
//mongoose.connect(database.url);

service.getCompany = getAllCompany;

module.exports = service;

function getAllCompany(){
    var deferred = Q.defer();
    var Company = mongoose.model('Company',company);

    Company.find({},function(err,com){
        if(err){deferred.reject(err)};

        if(com){
            deferred.resolve(com)
        }
        else{
            deferred.resolve()
        };
    })

    return deferred.promise;
}