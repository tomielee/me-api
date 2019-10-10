/*
* REPORTS
*/
var express = require('express');
var router = express.Router();


//Database
const sqlite3 = require('sqlite3').verbose();

//Models
const reports = require('../models/reports.js');

//Authenticate theck - check token
const withAuth = require('../middleware.js');


// middleware that is specific to this router
router.use(function (req, res, next) {
    console.log("router '/reports' works");
    next();
});

//RENDER ALL REPORTS
router.get("/", (req, res) => {
    reports.getAllReports(res)
});

//index of REPORTS // ADD REPORT ONLY VALID WITH TOKEN
router.post("/",
    // withAuth,
    (req, res) => reports.addReport(res, req.body)
);



//GET REPORT
router.get("/week/:id", (req, res) =>
    reports.getReport(res, req.params)
);



module.exports = router;