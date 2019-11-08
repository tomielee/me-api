// routes for /hello
//
"use strict";

var express = require('express');
var router = express.Router();

// middleware that is specific to this router
// router.use(function (req, res, next) {
//     console.log("router '/hello' works");
//     next();
// });

//HOME OF HELLO
router.get('/', function (req, res, next) {
    const data = {
        data: {
            msg: "This is hello"
        }
    };

    res.json(data);
});

//HELLO/MSG
router.get("/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

module.exports = router;