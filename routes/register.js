/*
* Route for /register
*/
const express = require("express");
const router = express.Router();

//models
const auth = require("../models/auth");

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//register form 
router.post('/', urlencodedParser, async (req, res, next) => {
    const { name, email, password, birthday } = req.body;

    try {
        await auth.register({ name, email, password, birthday });
        const message = "User registered";

        res.status(201).json({
            data: { message },
        });
    } catch(ex) {
        next(ex);
    }
});



module.exports = router;
