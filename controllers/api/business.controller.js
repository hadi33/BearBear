var config = require('config/runconfig');
var express = require('express');
var router = express.Router();
var businessService = require('services/business.service');


// routes
router.get('/getCompany', getCompany);

module.exports = router;

function getCompany(req, res) {
    businessService.getCompany()
        .then(function (com) {
            if (com) {
                // authentication successful
                res.send(com);
            } else {
                // authentication failed
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
