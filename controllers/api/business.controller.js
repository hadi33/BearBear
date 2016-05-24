var config = require('config/runconfig');
var express = require('express');
var router = express.Router();
var businessService = require('services/business.service');


// routes
router.get('/getCompany', getCompany);
router.get('/getProfitCenter', getProfitCenter);

module.exports = router;

function getCompany(req, res) {
    businessService.getCompany()
        .then(function (com) {
            if (com) {
                // get successful
                res.send(com);
            } else {
                // get failed
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getProfitCenter(req, res) {
    businessService.getProfitCenter()
        .then(function (profits) {
            if (profits) {
                // get successful
                res.send(profits);
            } else {
                // get failed
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
