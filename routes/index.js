var express = require('express');
var router = express.Router();

// middleware that is specific to this router
// router.use(function (req, res, next) {
//     console.log("router '/index' works");
//     next();
// });

router.get('/', function (req, res, next) {
    const data = {
        data: {
            title: "About me",
            text: "Hello my name is J this is a presentation of me in my ME-App. I'm a rookie but I really like learning software development!"
        }
    };
    res.json(data);
});


module.exports = router;