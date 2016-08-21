const neo4j = require('neo4j');
let db = new neo4j.GraphDatabase('http://neo4j:7474');

module.exports = db;
