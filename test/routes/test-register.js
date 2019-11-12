/**
 * Test for routes/app
 */
"use strict";
/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../app.js');

chai.should(); //use strict

chai.use(chaiHttp);


describe('Register', () => {
    /*
    * Reset the database before running the data
    */
   
    /*
    * Test the POST route without password
    */
    describe('POST /register', () => {

        it('should get 401 - invalid password', (done) => {
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
