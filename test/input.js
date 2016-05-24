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
// var async = require('async');



// company batch input
// var company = mongoose.Schema({
//     comcode: String,
//     name: String,
//     city: String,
//     country: String,
//     currency: String
// });
//
// var Company = mongoose.model('Company',company);
//
// mongoose.connect(database.url);
//
// var json = JSON.parse(fs.readFileSync('company.json'));
//
// for(var i=0;i<json.length;i++) {
//
//     console.log(json[i]);
//     item = json[i];
//     company = new Company();
//     company.comcode = item.comcode;
//     company.name = item.name;
//     company.city = item.city;
//     company.country = item.country;
//     company.currency = item.currency;
//
//     company.save(function (err, com) {
//         com.save(function (err, doc) {
//             if (err) {
//                 console.log('error');
//             } else {
//                 console.log('success');
//             }
//         })
//     });
// }
//
//
// ;
//
// // prifit center batch input
// var profitCenter = mongoose.Schema({
//     profit_center: String,
//     comcode: String,
//     text: String,
//     profit_group: String,
//     lock: String
// });
//
// var profitCenter = mongoose.model('ProfitCenter',profitCenter);
//
// mongoose.connect(database.url);
//
// var json = JSON.parse(fs.readFileSync('profitCenter.json'));
//
// for(var i=0;i<json.length;i++) {
//
//     console.log(json[i]);
//     item = json[i];
//     profit  = new profitCenter();
//     profit.profit_center = item.profit_center;
//     profit.comcode = item.comcode;
//     profit.text = item.text;
//     profit.profit_group = item.profit_group;
//     profit.lock = item.lock;
//
//     profit.save(function (err, profit) {
//         profit.save(function (err, doc) {
//             if (err) {
//                 console.log('error');
//             } else {
//                 console.log('success');
//             }
//         })
//     });
// }


;

