//var xls2json = require('xls2json');
//
//var inputpath = '/webstorm/bearBear/test/company.xls';
//var outputpath = '/webstorm/bearBear/test/company.json';
//
//xls2json.convertFile(inputpath,
//    outputpath,
//    function(err,data) {
//        if (err) {
//            console.log('success');
//            // there was an error
//        } else {
//            // it's all good
//            console.log('error');
//        }
//    }
//);

/**
 * Created by Qianxiong.Zheng on 2016/5/4.
 */
var mongoose = require('mongoose');
var database = require('../config/db');
var fs = require('fs');
var async = require('async');


var company = mongoose.Schema({
    company: String,
    name: String
});

var Company = mongoose.model('Company',company);

mongoose.connect(database.url);

var json = JSON.parse(fs.readFileSync('company.json'));

for(var i=0;i<json.length;i++) {

    console.log(json[i]);
    item = json[i];
    company = new Company();
    company.company = item.company;
    company.name = item.name;
    company.save(function (err, com) {
        com.save(function (err, doc) {
            if (err) {
                console.log('error');
            } else {
                console.log('success');
            }
        })
    });
}

//
////var schema = new companySchema();
//async.forEachSeries(json, function (item, callback) {
//    console.log(item);
//    company = new Company();
//    company.company = item.company;
//    company.name = item.name;
//    //company.save(function (err, com) {
//    //    com.save(function (err, doc) {
//    //        if (err) {
//    //            console.log('error');
//    //        } else {
//    //            console.log('success');
//    //        }
//    //    })
//    //});
//})
;

