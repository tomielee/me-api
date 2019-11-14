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
const auth = require("../../models/auth.js");


// Handle hashing password
const bcrypt = require('bcryptjs');
const saltRounds = 10;
let token;

chai.should(); //use strict
chai.use(chaiHttp);

describe('Reports', () => {
    /*
    * Create tables users and reports.
    */
    before(async () => {
        let sql_create_users = "CREATE TABLE IF NOT EXISTS users (name, email, birthday, password);";
        let sql_create_reports = "CREATE TABLE IF NOT EXISTS reports (id, title, text);";

        await db.run(sql_create_users);
        await db.run(sql_create_reports);
    });

    /*
    * Insert test content in users.
    */
    beforeEach(async () => {
        const hash = await bcrypt.hash("Passw0rd!", saltRounds);
        const user = ["Donald Duck", "donald.duck@reports.com", "9 June 1934", hash];
        const report = [3, "testtitel", "test text. ÅÄÖ shouldn't have an effect."];

        await db.run("INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);", user);
        await db.run("INSERT INTO reports (id, title, text) VALUES(?, ?, ?);", report);

        token = auth.signToken({
            name: "Donald Duck",
            email: "donald.duck@reports.com",
        });
    });

    /*
    * Delete tables users and reports.
    */
    afterEach(async () => {
        const sql_delete_users = "DELETE FROM users;";
        await db.run(sql_delete_users);

        const sql_delete_reports = "DELETE FROM reports;";
        await db.run(sql_delete_reports);

        // Ensure token is renewed
        token = null;
    });
    
    /*
    * Drop tables users and reports.
    */
    after(async () => {
        const sql_drop_users = "DROP TABLE IF EXISTS users;";
        await db.run(sql_drop_users);

        const sql_drop_reports = "DROP TABLE IF EXISTS reports;";
        await db.run(sql_drop_reports);
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
        })
    });

    // /*
    // * Test the /GET - fetch a report
    // */
    // describe('GET /week/:id', () => {
    //     it('Should return 200', (done) => {
    //         let id = 3;

    //         console.log(params.id);
    //         chai.request(server)
    //             .get("/reports/week/" + id)
    //             .end((err, res) => {
    //                 if (err) { console.log(err)};
    //                 console.log(res);
    //                 res.should.have.status(200);
    //                 done()
    //             });
    //     })
    // });
});
