/**
 * Test for routes/app
 */
"use strict";
/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../app.js');
const db = require("../../db/database.js");


// Handle hashing password
const bcrypt = require('bcryptjs');
const saltRounds = 10;

chai.should(); //use strict
chai.use(chaiHttp);

let token = "";

describe('Reports', () => {
    /*
    * Create tables users and reports.
    */
    before(() => {
        let sql_create_users = "CREATE TABLE IF NOT EXISTS users (name, email, birthday, password);";
        let sql_create_reports = "CREATE TABLE IF NOT EXISTS reports (id, title, text);";

        return new Promise((resolve) => {
            db.run(sql_create_users, (err) => {
                if (err) {
                    console.error("Could not create table users.", err.message);
                };
                db.run(sql_create_reports, (err) => {
                    if (err) {
                        console.error("Could not create table reports", err.message);
                    }
                    resolve();
                });
            });
        });

    });

    /*
    * Insert test content in users.
    */
    beforeEach(() => {
        return new Promise((resolve) => {
            bcrypt.hash("Passw0rd!", saltRounds, (err, hash) => {
                if (err) {
                    console.error("Could not create hash.");
                }
                const user = ["Donald Duck", "donald.duck@reports.com", "9 June 1934", hash];
                
                db.run("INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);", user), (err) => {
                    if (err) {
                        console.error("Could not insert content in users.");
                    }

                    const report = [3, "testtitel", "test text. ÅÄÖ shouldn't have an effect."];
                    db.run("INSERT INTO reports (id, title, text) VALUES(?, ?, ?);", report), (err) => {
                        if (err) {
                            console.error("Could not insert content in reports.");
                        }
                        resolve();
                    };
                };

            });
        })
        // try {
        //     const hash = await bcrypt.hash("Passw0rd!", saltRounds);

        //     await db.run("INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);", user);
        //     await db.run("INSERT INTO reports (id, title, text) VALUES(?, ?, ?);", report);

        // } catch (ex) {
        //     console.error(ex);
        // }
    
    });

    /*
    * Delete tables users and reports.
    */
    afterEach((done) => {
        const sql_delete_users = "DELETE FROM users;";
        db.run(sql_delete_users);

        const sql_delete_reports = "DELETE FROM reports;";
        db.run(sql_delete_reports);
        done();
    });
    
    /*
    * Drop tables users and reports.
    */
    after((done) => {
        const sql_drop_users = "DROP TABLE IF EXISTS users;";
        db.run(sql_drop_users);

        const sql_drop_reports = "DROP TABLE IF EXISTS reports;";
        db.run(sql_drop_reports);
        done();
    });



    /*
    * Test the /GET route
    */
    describe('GET /reports', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reports")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route - with error
    */
    describe('POST /reports', () => {
        it('Should get 401 - no token provided', (done) => {
            chai.request(server)
                .post("/reports")
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('Should get 200 - logging in', (done) => {
            let user = {
                email: "donald.duck@reports.com",
                password: "Passw0rd!"
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.have.property("token");

                    token = res.body.data.token;

                    done();
                });
        });

        it('should get 201 - adding a report', (done) => {
            let report = {
                title: "titel",
                text: "text"
            };

            chai.request(server)
                .post('/reports')
                .set("x-access-token", token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });


    /*
    * Test /PUT - edit reports
    */
    describe('PUT /report/edit', () => {
        it('should get 201 - edit report', (done) => {
            let report = {
                id: 3,
                title: "titel",
                text: "text"
            };

            chai.request(server)
                .put('/reports/edit')
                .set("x-access-token", token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(201);
                    done()
                })
        }
            
        )
    });

    /*
    * Test the /GET - fetch a report
    */
    describe('GET /week/:id', () => {
        it('Should return 200', (done) => {
            let id = 3;

            chai.request(server)
                .get("/reports/week/" + id)
                .end((err, res) => {
                    if (err) { console.log(err)}
                    res.should.have.status(200);
                    done()
                });
        })
    });
});