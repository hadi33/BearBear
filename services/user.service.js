var config = require('config/runconfig');
var mongoose = require('mongoose');
var database = require('config/db');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var User = require('models/User');

var service = {};
mongoose.connect(database.url);

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.getByEmail = getByEmail;
service.createVerificationToken = createVerificationToken;
service.getByValidation = getByValidation;
service.changePassword = changePassword;
// service.update = update;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();
    username = username.toLowerCase();  // conver to low case
    if (username.indexOf('@') !== -1) {
        User.findOne({email: username}, function (err, user) {
            if (err) deferred.reject(err);

            if (user && bcrypt.compareSync(password, user.password)) {
                // authentication successful
                deferred.resolve(jwt.sign({sub:user._id},config.secret));
            } else {
                // authentication failed
                deferred.resolve();
            }
        });
    } else {
        User.findOne({username: username}, function (err, user) {
            if (err) deferred.reject(err);

            if (user && bcrypt.compareSync(password, user.password)) {
                // authentication successful
                deferred.resolve(jwt.sign({sub:user._id},config.secret));
            } else {
                // authentication failed
                deferred.resolve();
            }
        });
    }

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    User.findById(_id,'username email', function (err, user) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without  password and token)
            deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getByEmail(email) {
    var deferred = Q.defer();
    // check email
    email = email.toLowerCase(); // convert to lower case
    User.findOne(
        {email: email},
        function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                //without password and token
                deferred.resolve(_.omit(user, ['password', 'token']))
            } else {
                deferred.resolve();
            }
        }
    )
    return deferred.promise;
}

function createVerificationToken(email) {
    var deferred = Q.defer();
    email = email.toLowerCase(); // convert to lower case
    User.findOne({email:email},
        function (err,doc) {
            if(err) deferred.reject(err);

            if(doc){
                // use timestamp and user email to generate virification token
                var timestamp = new Date().getTime();
                doc.verificationToken = jwt.sign(doc.email+timestamp, config.secret);
                doc.save();
                deferred.resolve(doc.verificationToken)
            }else{
                deferred.reject('找不到email:'+email);
            }

    });
    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();
    userParam.username = userParam.username.toLowerCase(); // convert to lower case
    userParam.email = userParam.email.toLowerCase(); // convert to lower case

    // validation
    User.findOne(
        {username: userParam.username},
        function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                // username already exists
                deferred.reject('用户名: "' + userParam.username + '" 已经存在');
            } else {
                User.findOne({email: userParam.email},
                    function (err, user) {
                        if (err) deferred.reject(err);
                        if (user) {
                            // email already exists
                            deferred.reject('邮箱: "' + userParam.email + '" 已经存在');
                        } else {
                            createUser();
                        }
                    });

            }
        });

    function createUser() {

        // register account
        var userModel = new User();
        userModel.username = userParam.username;
        userModel.email = userParam.email;
        userModel.password = userModel.generateHash(userParam.password);
        userModel.role = 'Unverified';
        userModel.save(function (err, user) {
            user.token = jwt.sign(user, config.secret);
            user.verificationToken = '';
            user.save(function (err, doc) {
                if (err) deferred.reject(err);
                deferred.resolve();
            })
        });

    }

    return deferred.promise;
}

function getByValidation(validationToken) {
    var deferred = Q.defer();
    User.findOne(
        {verificationToken: validationToken},
        function (err, user) {
            if (err) deferred.reject(err);
            if (user) {
                //without password and token
                deferred.resolve(_.omit(user, ['password', 'token']))
            } else {
                deferred.resolve();
            }
        }
    )

    return deferred.promise;
}

function changePassword(req) {
    var deferred = Q.defer();
    User.findOne(
        {verificationToken: req.body.validationToken},
        function (err, user) {
            if (err) deferred.reject(err);
            if (user) {
                //without password and token
                var userModel = new User();
                user.verificationToken = '';
                user.password = userModel.generateHash(req.body.password);
                user.token = '';
                user.token = jwt.sign(user, config.secret);
                user.save();
                deferred.resolve()
            } else {
                deferred.resolve();
            }
        }
    )

    return deferred.promise;
}
//
// function update(_id, userParam) {
//     var deferred = Q.defer();
//
//     // validation
//     usersDb.findById(_id, function (err, user) {
//         if (err) deferred.reject(err);
//
//         if (user.username !== userParam.username) {
//             // username has changed so check if the new username is already taken
//             usersDb.findOne(
//                 { username: userParam.username },
//                 function (err, user) {
//                     if (err) deferred.reject(err);
//
//                     if (user) {
//                         // username already exists
//                         deferred.reject('Username "' + req.body.username + '" is already taken')
//                     } else {
//                         updateUser();
//                     }
//                 });
//         } else {
//             updateUser();
//         }
//     });
//
//     function updateUser() {
//         // fields to update
//         var set = {
//             firstName: userParam.firstName,
//             lastName: userParam.lastName,
//             username: userParam.username,
//         };
//
//         // update password if it was entered
//         if (userParam.password) {
//             set.hash = bcrypt.hashSync(userParam.password, 10);
//         }
//
//         usersDb.findAndModify(
//             { _id: _id },
//             { $set: set },
//             function (err, doc) {
//                 if (err) deferred.reject(err);
//
//                 deferred.resolve();
//             });
//     }
//
//     return deferred.promise;
// }
//
// function _delete(_id) {
//     var deferred = Q.defer();
//
//     usersDb.remove(
//         { _id: _id },
//         function (err) {
//             if (err) deferred.reject(err);
//
//             deferred.resolve();
//         });
//
//     return deferred.promise;
// }