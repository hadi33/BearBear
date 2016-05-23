var Q = require('q');
var fs = require('fs');
var _ejs = require('ejs');
var userService = require('services/user.service');
var mail_sender = require('config/email');
var config = require('config/runconfig');
var nodemailer = require('nodemailer');
var service = {};

service.sendEmail = sendEmail;

module.exports = service;

function sendEmail(email) {
    var deferred = Q.defer();
    userService.createVerificationToken(email)
        .then(function (token) {
            // sendEmail to user account
            var transporter = getSmtpsporter();
            createEmailHtml(token)
                .then(function (html) {
                    var mainOptions = getMailOptions(mail_sender.auth.user, email, 'BearBear找回密码', '', html);
                    transporter.sendMail(mainOptions, function (err, data) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            console.log('token have send to ' + email);
                            deferred.resolve('成功发送,请登录邮箱查看');
                        }
                    });
                })
                .catch(function (err) {
                    deferred.reject(err);
                });

        })
        .catch(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}


function getSmtpsporter() {
    return nodemailer.createTransport({
        host: mail_sender.host,
        auth: mail_sender.auth,
    })
}

function getMailOptions(from, to, subject, text, html) {
    return {
        from: from,
        to: to,
        subject: subject,
        html: html,
        text: ''
    }
}
function createEmailHtml(token) {
    var deferred = Q.defer();
    var link = config.url + 'res_pass?' + token;
// specify jade template to load
    var template = 'views/emailTemplate.ejs';

    // get template from file system
    fs.readFile(template, 'utf8', function (err, file) {
        if (err) {
            //handle errors
            console.log('ERROR!');
            deferred.resolve(link);
        }
        else {
            //compile ejs template into function
            var compiledTmpl = _ejs.compile(file, {filename: template});
            // set context to be used in template
            var context = {link: link};
            // get html back as a string with the link applied;
            var html =  compiledTmpl(context);
            deferred.resolve(html);
        }
    });

    return deferred.promise;
}