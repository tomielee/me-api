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
    before((done) => {
        let sql_users = "CREATE TABLE IF NOT EXISTS users (name, email, birthday, password);";
        db.run(sql_users);

        let sql_reports = "CREATE TABLE IF NOT EXISTS reports (id, title, text);";
        db.run(sql_reports);
        done();
    });

    /*
    * Insert test content in users.
    */
    beforeEach(async function () {
        try {
            const hash = await bcrypt.hash("Passw0rd!", saltRounds);
            const body = [
                "Donald Duck",
                "donald.duck@reports.com",
                "9 June 1934",
                hash
            ];

            await db.run("INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);", body);
        } catch (ex) {
            console.error(ex);
        }
    })

    /*
    * Delete tables users and reports.
    */
    afterEach((done) => {
        const sql_users = "DELETE FROM users;";
        db.run(sql_users);

        const sql_reports = "DELETE FROM reports;";
        db.run(sql_reports);
        done();
    });
    
    /*
    * Drop tables users and reports.
    */
    after((done) => {
        const sql_users = "DROP TABLE IF EXISTS users;";
        db.run(sql_users);

        const sql_reports = "DROP TABLE IF EXISTS reports;";
        db.run(sql_reports);
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
        it('Should get 401  - no token provided', (done) => {
            chai.request(server)
                .post("/reports")
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        // it('Should get 201 - register a user', (done) => {
        //     const body = {
        //         name: "Donald Duck",
        //         email: "donald.duck@reports.com",
        //         birthday: "9 June 1934",
        //         password: "Passw0rd!"
        //     }

        //     chai.request(server)
        //         .post('/register')
        //         .send(body)
        //         .end((err, res) => {
        //             res.should.have.status(201);
        //             res.body.should.be.a('object');
        //             done();
        //         });
        // });

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
                id: 1,
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
            let id = 1

            chai.request(server)
                .get("/reports/week/" + id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done()
                });
        })
    });

    // after(() => {
    //     return new Promise((resolve) => {
    //         db.run("DELETE FROM users;", (err) => {
    //             if (err) {
    //                 console.error("Could not delete all from users.", err.message);
    //             }

    //             resolve();
    //         });
    //     });
    // });

});