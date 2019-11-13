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


describe('Register', () => {
    /*
    * Create tables users.
    */
    before(() => {
        return new Promise((resolve) => {
            let sql_create = "CREATE TABLE IF NOT EXISTS users (name, email, birthday, password);";
            db.run(sql_create, (err) => {
                if (err) {
                    console.log("Could not create table users.");
                }
                resolve();
            });
        });
    });

    /*
    * Delete tables users.
    */
    afterEach((done) => {
        const sql_delete = "DELETE FROM users;";
        db.run(sql_delete);
        done();
    });

    /*
    * Drop tables users.
    */
    after((done) => {
        const sql_drop = "DROP TABLE IF EXISTS users;";
        db.run(sql_drop);
        done();
    });


    /*
    * Test the POST route without password
    */
    describe('POST /register', () => {

        it('should get 401 - invalid no password', (done) => {
            const body = {
                name: "Donald Duck",
                email: "donald.duck@example.com",
                birthday: "9 June 1934"
            }

            chai.request(server)
                .post('/register')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('should get 201 - register a new user', (done) => {
            const body = {
                name: "Donald Duck",
                email: "donald.duck@register.com",
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

    }); 

});
