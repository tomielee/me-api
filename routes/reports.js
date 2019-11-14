/*
* REPORTS
*/
const express = require("express");
const router = express.Router();

//Models
const reports = require("../models/reports");

//Authenticate theck - check token
const withAuth = require("../middleware");


// middleware that is specific to this router
// router.use(function (req, res, next) {
//     console.log("router '/reports' works");
//     next();
// });

//Index of Reports
// Get ALL
router.get("/", async (req, res, next) => {
    try {
        const all = await reports.all();

        res.status(200).json({
            data: {
                message: "Reports successfully retreived",
                reports: all,
            },
        });
    } catch(ex) {
        next(ex);
    }
});

// Add report
router.post("/", withAuth, async (req, res, next) => {
    const { title, text } = req.body;

    try {
        await reports.add({ title, text });

        const message = "Report successfully added";

        res.status(201).json({
            data: { message },
        });
    } catch(ex) {
        next(ex);
    }
});

//Edit report
router.put("/edit", withAuth, async (req, res, next) => {
    const { id, title, text } = req.body;

    try {
        await reports.edit({ id, title, text });

        const message = "Report successfully edited";

        res.status(201).json({
            data: { message },
        });
    } catch(ex) {
        next(ex);
    }
});

//Get A report
router.get("/week/:id",async (req, res, next) => {
    const { id } = req.params;

    try {
        const report = await reports.get(id);
        const message = "Report successfully retreived";

        res.status(200).json({
            data: { message, report },
        });
    } catch(ex) {
        next(ex);
    }
});



module.exports = router;
