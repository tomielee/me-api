/**
* module reports
* addreport 
*/
"use strict";

// Database
const db = require("../db/database");

const reports = {
    async add(data) {
        const { title, text } = data;
        const sql = "INSERT INTO reports (title, text) VALUES(?, ?)";

        return db.run(sql, [title, text]);
    },

    async edit(data) {
        const { id, title, text } = data;
        const sql = "UPDATE 'reports' SET title = ?, text = ? WHERE id = ?;";

        return db.run(sql, [title, text, id]);
    },

    async all() {
        return db.all("SELECT * FROM reports;");
    },

    async get(id) {
        const sql = "SELECT * FROM reports WHERE id = ?;";

        return db.get(sql, [id]);
    },
}

module.exports = reports;
