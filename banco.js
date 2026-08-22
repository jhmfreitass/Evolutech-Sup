const Database = require("better-sqlite3");

const db = new Database("banco.db");

console.log("Banco de dados conectado!");

module.exports = db;