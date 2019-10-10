/**
* module reports
* addreport 
*/
"use strict";


//Database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');


const reports = {
    addReport: function (res, body) {
        const title = body.title;
        const text = body.text;
        
        let newReport = [title, text];

        db.run("INSERT INTO reports (title, text) VALUES(?, ?)",
            newReport, 
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            source: "/reports",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                return res.status(201).json({
                    data: {
                        msg: "Report sucessfully added!"
                    }
                });

            }
        );
    },

    editReport: function (res, body) {
        const id = body.id;
        const title = body.title;
        const text = body.text;

        let newReport = [title, text, id];
        console.log(newReport);

        let query = "UPDATE reports SET title='" + title + "', text='" + text + "' WHERE id=" + id + ";";
        console.log(query);
        db.run(query,
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            source: "/reports/edit",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                return res.status(201).json({
                    data: {
                        msg: "Report sucessfully updated!"
                    }
                });

            }
        );
    },

    getAllReports: function (res) {
        const sql = "SELECT * FROM reports;";
        
        db.all(
            sql,
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            source: "/reports",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                
                // console.log("skickar med" , result);

                return res.json(result);
            } 
        )
        

    },

    getReport: function (res, param) {
        const sql = "SELECT * FROM reports WHERE id IS(?);";
        const id = param.id;

        db.each(
            sql,
            id,
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            source: "/reports/week/:id",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                let report = result;

                return res.json({
                    title: report.title,
                    text: report.text
                });
            }
        );
    }
}


module.exports = reports;