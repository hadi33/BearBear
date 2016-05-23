/**
 * Created by Qianxiong.Zheng on 2016/5/4.
 */
var User = require('./models/User');
var eveconfig = require('config/runconfig');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var mail_sender = require('config/email')
module.exports = function (app, jwt) {

    app.use(['/','/login'], function (req, res) {
        // res.sendfile('./public/login.html');
        res.render('login');
    });

    app.get('/home', ensureAuthorized, function (req, res) {

        var User = checkTokenExist(req.body.token);
        if (typeof User === 'undefined') {
            res.sendfile('./public/main.html');
        } else {
            res.redirect('/login');
        }

    });


    // app.get('/login', function (req, res) {
    //     // redirect to login HTML file
    //     res.sendfile('./public/login.html');
    // });
    //
    // app.get('/home', function (req, res) {
    //     // redirect to main HTML file
    //     res.sendfile('./public/main.html');
    // });

    app.get('/res_pass/:token', function (req, res) {
        res.sendfile('./public/main.html');
    });

    app.get('/api/ego', ensureAuthorized, function (req, res) {
        console.log(req.body.token);
        User.findOne({token: req.body.token}, function (err, user) {
            if (err) {
                console.log('Error occurred in fetching user' + err)
                res.json({
                    success: false,
                    data: 'Error occurred ' + err
                });

            } else {
                if (user !== null) {
                    console.log('Success fetching user' + user.username);
                    res.json({
                        success: true,
                        username: user.username
                    });

                } else {
                    res.json({
                        success: false,
                        data: '验证失败：不存在！'
                    });

                }

            }

        });

    });


    // default
    app.get('*', function (req, res) {
        res.redirect('/login');
    });

    app.post('/api/authenticate', function (req, res) {
        if (req.body.username.indexOf('@') !== -1) {
            // get user by email
            User.findOne({
                    email: req.body.username
                }, function (err, user) {
                    if (err) {
                        console.log('Authentication error');
                        res.json({
                            success: false,
                            data: 'Error in authentication' + err
                        });
                    } else {
                        if (user) {
                            //compare passord
                            if (bcrypt.compareSync(req.body.password, user.password)) {
                                console.log('Authentication successful,returning token:' + user.token);
                                // return res.redirect("./public/views/index.html") ;
                                res.json({
                                    success: true,
                                    username: user.username,
                                    token: user.token
                                });
                            } else {
                                res.json({
                                    success: false,
                                    data: '密码错误'
                                });
                            }
                        } else {
                            console.log('Authentication failed');
                            res.json({
                                success: false,
                                data: '用户不存在'
                            });

                        }
                    }

                }
            );
        } else {
            // get user by username
            User.findOne({
                username: req.body.username
            }, function (err, user) {
                if (err) {
                    console.log('Authentication error');
                    res.json({
                        success: false,
                        data: 'Error in authentication' + err
                    });
                } else {
                    if (user) {
                        //compare passord
                        if (bcrypt.compareSync(req.body.password, user.password)) {
                            console.log('Authentication successful,returning token:' + user.token);
                            // return res.redirect("./public/views/index.html") ;
                            res.json({
                                success: true,
                                username: user.username,
                                token: user.token
                            });
                        } else {
                            res.json({
                                success: false,
                                data: '密码错误'
                            });
                        }
                    } else {
                        console.log('Authentication failed');
                        res.json({
                            success: false,
                            data: '用户不存在'
                        });

                    }
                }

            });
        }

    });
/// 注册
    app.post('/api/registration', function (req, res) {
        User.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) {
                console.log('Registration error' + err)
                res.json({
                    success: false,
                    data: 'Error in Registration' + err
                });
            } else {
                if (user) {
                    res.json({
                        success: false,
                        data: '用户已经存在'
                    });
                } else {
                    //check email
                    User.findOne({
                        email: req.body.email
                    }, function (err, user) {
                        if (err) {
                            console.log('Registration error' + err)
                            res.json({
                                success: false,
                                data: 'Error in Registration' + err
                            });
                        } else {
                            if (user) {
                                res.json({
                                    success: false,
                                    data: 'Email已经存在' + req.body.email
                                });
                            } else {
                                // register account
                                var userModel = new User();
                                userModel.username = req.body.username;
                                userModel.email = req.body.email;
                                userModel.password = userModel.generateHash(req.body.password);
                                userModel.role = 'Unverified';
                                userModel.save(function (err, user) {
                                    user.token = jwt.sign(user, app.get('superSecret'));
                                    user.save(function (err, user_r) {
                                        res.json({
                                            success: true,
                                            username: user_r.username,
                                            token: user_r.token
                                        });
                                    })

                                });
                            }
                        }
                    });
                }

            }

        });
    });

    // Send Email for reset password
    app.post('/api/respassword', function (req, res) {
        // check email exist?
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                console.log('SendEmail error' + err)
                res.json({
                    success: false,
                    data: 'Error in SendEmail' + err
                });
            } else {
                if (user) {
                    // send email
                    console.log('Send email to:' + req.body.email);
                    sendEmail(req, res, user);
                } else {
                    res.json({
                        success: false,
                        data: '邮箱：' + req.body.email + '尚未注册'
                    });
                }
            }
        });


    });

    function sendEmail(req, res, user) {
        var transporter = getSmtpsporter();
        var mainOptions = getMailOptions(mail_sender.auth.user, req.body.email, 'BearBear', req.body.text, null, user)
        transporter.sendMail(mainOptions, function (err, data) {
            if (err) {
                console.log('Error sending email: ' + err);
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                console.log('Email sent: ' + req.body.email);
                res.status(200).json({
                    success: true,
                    data: req.body.email
                });
            }
        });

    }

    function getSmtpsporter() {
        return nodemailer.createTransport({
            host: mail_sender.host,
            auth: mail_sender.auth,
        })
    }

    function getMailOptions(from, to, subject, text, html, recipientUser) {
        var verificationToken = jwt.sign(recipientUser.username, app.get('superSecret'));
        updateUserVerificationToken(verificationToken, recipientUser);
        return {
            from: from,
            to: to,
            subject: subject,
            text: eveconfig.url + 'res_pass/' + verificationToken,
            html: html
        }
    }

    function updateUserVerificationToken(verificationToken, user) {
        User.findOne({username: user.username}, function (err, user) {
            if (err) {
                console.log('fn updateUserVerificationToken:' + err);
                res.status(500).json({
                    success: false,
                    data: err
                });

            } else {
                user.verificationToken = verificationToken;
                user.save();
            }

        });

    }


    function ensureAuthorized(req, res, next) {
        // get token from request header
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.body.token = bearerToken;
            next();
        } else {
            console.log('ensureAuthorized: not authorized');
            res.status(403).json({
                success: false,
                data: 'Not authorized'
            });
        }
    }

    function checkTokenExist(token) {
        User.findOne({token: token}, function (err, user) {
            if (err) {
                console.log('Error occurred in fetching user' + err)
                res.json({
                    success: false,
                    data: 'Error occurred ' + err
                });

            } else {
                return user;
            }

        });
    }
}