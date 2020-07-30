var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    const data = {
        data: {
            title: "About me",
            text: "Hello! This is a presentation of me in my ME-app."
        }
    };
    res.json(data);
});


module.exports = router;