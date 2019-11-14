/*
* LOGIN
*/
const express = require("express");
const router = express.Router();

const auth = require("../models/auth");


//index of LOGIN
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { user, token } = await auth.login(email, password);
        const message = "User logged in";
        const data = { message, user, token };

        res.status(200).json({ data });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
