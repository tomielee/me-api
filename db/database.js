const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

module.exports = (function() {
  let db;

  if (process.env.NODE_ENV === 'test') {
    db = new sqlite3.Database('./db/test.sqlite');
  } else {
    db = new sqlite3.Database('./db/texts.sqlite');
  }

  return {
    get: promisify(db.get).bind(db),
    all: promisify(db.all).bind(db),
    run: promisify(db.run).bind(db),
  };
})();
