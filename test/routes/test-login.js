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

chai.should(); //use strict
chai.use(chaiHttp);

describe('Login', () => {
    /*
    * Create tables users.
    */
    before(async function () {
        let sql_create = "CREATE TABLE IF NOT EXISTS users (name, email, birthday, password);";
        await db.run(sql_create);
    });

    /*
    * Insert test content in users.
    */
    beforeEach(async function () {
        try {
            const hash = await bcrypt.hash("Passw0rd!", saltRounds);
            const body = [
                "Donald Duck",
                "donald.duck@testlogin.com",
                "9 June 1934",
                hash
            ];

            await db.run("INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);", body);
        } catch (ex) {
            console.error(ex);
        }
    })

    /*
    * Delete all content from tables users.
    */
    afterEach(async function() {
        const sql_delete = "DELETE FROM users;";
        await db.run(sql_delete);

    });

    /*
    * Drop tables users.
    */
    after(async function () {
        const sql_drop = "DROP TABLE IF EXISTS users;";
        await db.run(sql_drop);
    });

    /*
    * Test the /GET route
    */
    describe('GET /login', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/login")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('POST /login', () => {
        it('should get 401 - wrong password.', (done) => {
            const body = {
                userEmail: "donald.duck@testlogin.com",
                userPassword: "InvalidPassw0rd!"
            }

            chai.request(server)
                .post('/login')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('should get 401 - user not found.', (done) => {
            const body = {
                userEmail: "mickey.mouse@example.com",
                userPassword: "Passw0rd!"
            }

            chai.request(server)
                .post('/login')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('should get 200 - login success.', (done) => {         
            const body = {
                email: "donald.duck@testlogin.com",
                password: "Passw0rd!"
            }

            chai.request(server)
                .post('/login')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});