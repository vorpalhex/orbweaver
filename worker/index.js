const neo4j = require('neo4j');
let db = new neo4j.GraphDatabase('http://localhost:7474');

const WORK_INTERVAL = 5 * 1000;

function addRelationship(cb){
  db.cypher({
    query: `MATCH (d:Domain),(ip:IP)
    WITH d,ip
    LIMIT 100
    WHERE rand() < 0.3
    CREATE (d)-[:HAS]->(ip)`,
  }, cb);
}

function removeRelationship(cb){
  db.cypher({
    query: `MATCH (d:Domain)-[r:HAS]-(ip:IP)
    WITH d,ip
    LIMIT 100
    WHERE rand() < 0.3
    DELETE r`,
  }, cb);
}

function doSomethingRandom(){
  if (Math.random() > 0.5) {
    console.log('Adding Records...');
    addRelationship(genericCB);
  }else{
    console.log('Removing Records...');
    removeRelationship(genericCB);
  }
}

function genericCB(err, result){
  if(err) console.log('ERR', err);
}

setInterval(doSomethingRandom, WORK_INTERVAL);
