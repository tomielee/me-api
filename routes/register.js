/*
* Route for /register
*/
var express = require('express');
var router = express.Router();

//models
const auth = require("../models/auth.js");

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// middleware that is specific to this router
// router.use(function (req, res, next) {
//     console.log("router '/register' works");
//     next();
// });


//register form 
router.post('/', urlencodedParser, 
    (req, res) => {
        auth.registerUser(res, req.body)
    }
);



module.exports = router;