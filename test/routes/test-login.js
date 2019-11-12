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

describe('Login', () => {
    /*
    * Create tables users.
    */
    before((done) => {
        let sql_users = "CREATE TABLE IF NOT EXISTS users (name, email, birthday, password);";
        db.run(sql_users);
        done();
    });

    /*
    * Insert test content in users.
    */
    beforeEach(async function () {
        const hashed = await bcrypt.hash("Passw0rd!", saltRounds, (err, hash) => { return hash });
        const body = {
            name: "Donald Duck",
            email: "donald.duck@testlogin.com",
            birthday: "9 June 1934",
            password: hashed
        };
        await db.run("INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);", body);

    })

    /*
    * Delete tables users.
    */
    afterEach((done) => {
        const sql_users = "DELETE FROM users;";
        db.run(sql_users);
        done();
    });

    /*
    * Drop tables users.
    */
    after((done) => {
        const sql_users = "DROP TABLE IF EXISTS users;";
        db.run(sql_users);
        done();
    });

    /*
    * Test the /GET route
    */
    describe('GET /login', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/login")
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('POST /login', () => {
        // it('should get 201 - register a user', (done) => {
        //     const body = {
        //         name: "Donald Duck",
        //         email: "donald.duck@testlogin.com",
        //         birthday: "9 June 1934",
        //         password: "Passw0rd!"
        //     };

        //     chai.request(server)
        //         .post('/register')
        //         .send(body)
        //         .end((err, res) => {
        //             res.should.have.status(201);
        //             res.body.should.be.a('object');
        //             done();
        //         });
        // });

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
                .send(user)
                .end((err, res) => {
                    console.log(err)
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});