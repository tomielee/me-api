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

describe('Index', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});