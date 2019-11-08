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

chai.should(); //use strict

chai.use(chaiHttp);

describe('Login', () => {
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
        it('should get 201 - register a user', (done) => {
            const body = {
                name: "Donald Duck",
                email: "donald.duck@testlogin.com",
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