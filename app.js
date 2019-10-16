/**
 * app.js
 * kmom03
 * 
 */

"use strict";

const express = require("express");
const morgan = require('morgan'); //Handle log
const cors = require('cors'); //Handle third party use of API
const bodyParser = require("body-parser"); //Handle spaces and ÅÄÖ
const cookieParser = require('cookie-parser'); //Protect routes

const app = express();
//const port = 1337; //use on local
const port = 8333; //CHANGE ON SERVER

// //Set up CROSS ORIGN SETUP
// const whitelist = ['http://localhost:' + port, 'http://localhost:' + port + '/register', 'http://localhost:' + port + '/login', 'http://localhost:' + port + '/reports'];

// console.log(whitelist);
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }
app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//Req routes
const index = require('./routes/index');
const login = require('./routes/login');

const register = require('./routes/register');
const reports = require('./routes/reports');



// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// ROUTES  
app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/reports', reports);


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});


// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));




