var config = require('config/runconfig');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var emailService = require('services/email.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.post('/sendEmail',sendEmail);
router.get('/validationToken',getUserByValidationToken);
router.post('/changePassword',setPassword);
router.get('/current', getCurrentUser);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (doc) {
            if (doc) {
                res.send(doc);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function sendEmail(req, res) {
    emailService.sendEmail(req.body.email)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getUserByValidationToken(req,res) {
    userService.getByValidation(req.body.validationToken)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function setPassword(req,res) {
    userService.changePassword(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}