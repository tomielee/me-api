/*
* LOGIN
*/
var express = require('express');
var router = express.Router();

const auth = require('../models/auth.js');


// middleware that is specific to this router
router.use(function (req, res, next) {
    console.log("router '/login' works");
    next();
});

router.get("/", (req, res) => {
    auth.getUsers(res, req.body)
});

//index of LOGIN
router.post('/', 
    (req, res) => {
    auth.loginUser(res, req.body)
});

module.exports = router;