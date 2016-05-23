var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config/runconfig');

router.get('/', function (req, res) {

    req.body.validationToken = req.originalUrl.split('?')[1];
// authenticate using api to maintain clean separation between layers
    request.get({
        url: config.apiUrl + '/users/validationToken',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('res_pass', {error: 'An error occurred'});
        }

        if(body.email){
            return res.render('res_pass', {email: body.email});
        }else{
            return res.render('page_404');
        }



    });

});

router.post('/', function (req, res) {

    req.body.validationToken = req.originalUrl.split('?')[1];
// authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/changePassword',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('res_pass', {error: 'An error occurred'});
        }

        req.session.success = '密码已经成功修改，请重新登录';
        return res.redirect('/login');
    });

});

module.exports = router;