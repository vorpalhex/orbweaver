const neo4j = require('neo4j');
let db = new neo4j.GraphDatabase('http://localhost:7474');

//check to see if our record count
db.cypher({
  query: `MATCH (n) DETACH
          DELETE n`
}, function(err, results){
  console.log(err, results);
});
