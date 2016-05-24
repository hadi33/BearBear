var Q = require('q');
var mongoose = require('mongoose');
var database = require('config/db');
var models = require('models/Models');

var service = {};
//mongoose.connect(database.url);

service.getCompany = getAllCompany;
service.getProfitCenter = getAllProfitCenter;

module.exports = service;

// get all company data
function getAllCompany(){
    var deferred = Q.defer();
    var Company = models.company;

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

// get all profit Center data
function getAllProfitCenter(){
    var deferred = Q.defer();
    var center = models.profitcenter;
    center.find({},function(err,cen){
        if(err){deferred.reject(err)};

        if(cen){
            deferred.resolve(cen)
        }
        else{
            deferred.resolve()
        };
    })

    return deferred.promise;
}