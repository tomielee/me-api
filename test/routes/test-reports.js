/**
 * Test for routes/app
 */
"use strict";
/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../app.js');
const auth = require('../../models/auth.js');
const reports = require('../../models/reports.js');
const db = require("../../db/database.js");


chai.should(); //use strict
chai.use(chaiHttp);

let token = "";

describe('Reports', () => {

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

    // /*
    // * Test the /POST route - with error
    // */
    describe('POST /reports', () => {
        it('Should get 401  - no token provided', (done) => {
            chai.request(server)
                .post("/reports")
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('Should get 201 - register a user', (done) => {
            const body = {
                name: "Donald Duck",
                email: "donald.duck@reports.com",
                birthday: "9 June 1934",
                password: "Passw0rd!"
            }

            chai.request(server)
                .post('/register')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
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
        * Test /PUT
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

    // /*
    // * Test the /GET
    // */
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

    after(() => {
        return new Promise((resolve) => {
            db.run("DELETE FROM users;", (err) => {
                if (err) {
                    console.error("Could not delete all from users.", err.message);
                }

                resolve();
            });
        });
    });

});