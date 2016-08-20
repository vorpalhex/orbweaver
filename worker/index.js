const neo4j = require('neo4j');
let db = new neo4j.GraphDatabase('http://localhost:7474');
let ws = require('socket.io-client')('http://localhost:3000');

const WORK_INTERVAL = 5 * 1000;

function addRelationship(){
  db.cypher({
    query: `MATCH (d:Domain),(ip:IP)
    WITH d,ip
    LIMIT 100
    WHERE rand() < 0.3
    CREATE (d)-[:HAS]->(ip)
    RETURN d,ip`,
    lean: true
  }, (err, changes)=>{
    if(err) console.log(err);
    ws.emit('relationships_added', changes);
  });
}

function removeRelationship(){
  db.cypher({
    query: `MATCH (d:Domain)-[r:HAS]-(ip:IP)
    WITH d,r,ip
    LIMIT 100
    WHERE rand() < 0.3
    DELETE r
    RETURN d,ip`,
    lean: true
  }, (err, changes)=>{
    if(err) console.log(err);
    ws.emit('relationships_removed', changes);
  });
}

function doSomethingRandom(){
  if (Math.random() > 0.5) {
    console.log('Adding Records...');
    addRelationship();
  }else{
    console.log('Removing Records...');
    removeRelationship();
  }
}

ws.on('connect', function(socket){
  setInterval(doSomethingRandom, WORK_INTERVAL);
});
