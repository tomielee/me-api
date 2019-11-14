/**
* module auth
* register and login user
*/
"use strict";


//Database
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./db/texts.sqlite');
const db = require("../db/database.js");


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

    async registerUser(data) {
        const { name, email, birthday, password } = data;
        const sql = "INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);";

        if (!name || !email || !birthday || !password) {
            throw authError(401, "Value (name, email, birthday or password) missing");
        }

        const hash = await bcrypt.hash(password, saltRounds);

        return db.run(sql, [name, email, birthday, hash]);
    },

    async loginUser(data) {
        const { email, password } = data;
        const sql = "SELECT * FROM 'users' WHERE email = ?;";

        if (!userEmail || !userPassword) {
            throw authError(401, "Email or password missing");
        }

        const user = await db.get(sql, [email]);

        if (!user) {
            throw authError(401, "User not found");
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            throw authError(401, "Wrong password");
        }

        return auth.signToken({ email, name: user.name });
    },

    async getUsers() {
        db.all("SELECT * FROM 'users'");
    }

}

module.exports = auth;

// const auth = {
//     registerUser: function (res, body) {
//         const name = body.name;
//         const email = body.email;
//         const birthday = body.birthday;
//         const password = body.password;

//         let sql = "INSERT INTO users (name, email, birthday, password) VALUES(?, ?, ?, ?);"

//         if (!name || !email || !birthday || !password) {
//             return res.status(401).json({
//                 errors: {
//                     status: 401,
//                     source: "/register",
//                     title: "Value (name, email, birtday or password) missing",
//                     detail: "Value (name, email, birtday or password) missing in request",
//                 }
//             });
//         }

//         let params = [name, email, birthday];

//         // console.log(params);

//         bcrypt.hash(password, saltRounds, function(err, hash){
//             if (err) {
//                 return res.status(500).json({
//                     errors: {
//                         status: 500,
//                         source: "/register",
//                         title: "bcrypt error",
//                         detail: "bcrypt error"
//                     }
//                 });
//             }
//             params.push(hash);

//             db.run(sql,
//                 params,
//                 (err, result) => {
//                     if (err) {
//                         return res.status(500).json({
//                             errors: {
//                                 status: 500,
//                                 source: "/register",
//                                 title: "Database error",
//                                 detail: err.message
//                             }   
//                         })
//                     }

//                     return res.status(201).json({
//                         data: {
//                             msg: "form succesfully registered!"
//                         }
//                     })
//                 }
//                 )
//         })
//     },

//     loginUser: function(res, body) {
//         const userEmail = body.email;
//         const userPassword = body.password;

//         let sql = "SELECT * FROM 'users' WHERE email IS (?);";
        
//         if (!userEmail || !userPassword) {
//             return res.status(401).json({
//                 errors: {
//                     status: 401,
//                     source: "/login",
//                     title: "Email or password missing",
//                     detail: "Email or password missing in request"
//                 }
//             });
//         }

//         db.get(
//             sql,
//             userEmail,
//             (err, userfound) => {
//                 if (err) {
//                     return res.status(500).json({
//                         errors: {
//                             status: 500,
//                             source: "/login",
//                             title: "Database error",
//                             detail: err.message
//                         }
//                     });
//                 }

//                 if (userfound === undefined) {
//                     return res.status(401).json({
//                         errors: {
//                             status: 401,
//                             source: "/login",
//                             title: "User not found",
//                             detail: "User with provided email not found."
//                         }
//                     });
//                 }

//                 const user = userfound;

//                 bcrypt.compare(
//                     userPassword, user.password, 
//                     (err, result) => {
//                         if (err) {
                            
//                             return res.status(500).json({
//                                 errors: {
//                                     status: 500,
//                                     source: "/login",
//                                     title: "bcrypt error",
//                                     detail: "bcrypt error"
//                                 }
//                             });
//                         }


//                         if (result) {
//                             // console.log(userEmail);
//                             let payload = { 
//                                 name: user.name,
//                                 email: user.email
//                             };
//                             let secret = process.env.JWT_SECRET;
//                             let token = jwt.sign(payload, secret, { expiresIn: '1h' });
//                             // res.cookie('token', token, { httpOnly: true })
//                             return res.status(200).json({
//                                 data: {
//                                     type: "success",
//                                     message: "User logged in",
//                                     user: payload,
//                                     token: token
//                                 }
//                             });
                            
//                         }

//                         return res.status(401).json({
//                             errors: {
//                                 status: 401,
//                                 source: "/login",
//                                 title: "Wrong password",
//                                 detail: "Password is incorrect."
//                             }
//                         });

//                 });
//             }
//         )

//     },

//     getUsers: function (res, body) {
//         let sql = "SELECT * FROM 'users'";
        
//         db.all(
//             sql,
//             (err, result) => {
//                 if (err) {
//                     return res.status(500).json({
//                         errors: {
//                             source: "/login",
//                             title: "Database error",
//                             detail: err.message
//                         }
//                     });
//                 }

//                 let users = result;
//                 // console.log(users);

//                 return res.json(users);
//             }
//         );
//     },

// }


// module.exports = auth;