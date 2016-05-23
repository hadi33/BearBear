var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config/runconfig');

router.get('/', function (req, res) {
    var viewData = { success: req.session.success,
        error:req.session.error,
        email:req.session.email
        };
    delete req.session.success;
    delete req.session.error;
    delete req.session.email;

    res.render('sendemail',viewData);
});

router.post('/', function (req, res) {

    request.post({
        url:config.apiUrl + '/users/sendEmail',
        form:req.body,
        json:true
    },function (error,response,body) {
            if (error) {
                return res.render('sendemail', { error: 'An error occurred' });
            }

        if (response.statusCode !== 200) {
            var message = body.response;
            if(!message){
                // var message = body.;
                message = body.code;
            }

            return res.render('sendemail', {
                error:message,
                email:req.body.email
            });
        }

            return res.render('sendemail', {
                success:'成功发送,请登录邮箱点击链接进行密码重置',
                email:req.body.email
        });
        }
    )

    
    // // register using api to maintain clean separation between layers
    // request.post({
    //     url: config.apiUrl + '/users/register',
    //     form: req.body,
    //     json: true
    // }, function (error, response, body) {
    //     if (error) {
    //         return res.render('register', { error: 'An error occurred' });
    //     }
    //
    //     if (response.statusCode !== 200) {
    //         return res.render('register', {
    //             error: response.body,
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName,
    //             username: req.body.username
    //         });
    //     }
    //
    //     // return to login page with success message
    //     req.session.success = 'Registration successful';
    //     return res.redirect('/login');
    // }); // // register using api to maintain clean separation between layers

});

module.exports = router;