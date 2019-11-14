/**
* module auth
* register and login user
*/
"use strict";


//Database
const db = require("../db/database");


// Handle hashing password
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//JWT
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authError(status, message) {
    const error = new Error(message);
    error.status = status;

    return error;
}

const auth = {
    signToken(payload) {
        const secret = process.env.JWT_SECRET;

        return jwt.sign(payload, secret, { expiresIn: '1h' });
    },

    async register(data) {
        const { name, email, birthday, password } = data;
        const sql = "INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);";

        if (!name || !email || !birthday || !password) {
            throw authError(401, "Value (name, email, birthday or password) missing");
        }

        const hash = await bcrypt.hash(password, saltRounds);

        return db.run(sql, [name, email, birthday, hash]);
    },

    async login(email, password) {
        const sql = "SELECT * FROM 'users' WHERE email = ?;";

        if (!email || !password) {
            throw authError(401, "Email or password missing");
        }

        const user = await db.get(sql, [ email ]);

        if (!user) {
            throw authError(401, "User not found");
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            throw authError(401, "Wrong password");
        }

        return auth.signToken({ email, name: user.name });
    },

}


module.exports = auth;
