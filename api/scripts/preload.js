const _ = require('lodash');
const async = require('async');
const neo4j = require('neo4j');
let db = new neo4j.GraphDatabase('http://localhost:7474');

const NUM_RECORDS = 100000;

//check to see if our record count
db.cypher({
  query: `MATCH (d:Domain)-[:IP]-(ip) WITH d,count(ip) as ipCount RETURN ipCount`
}, function(err, results){
  if(results.length < 1 || results[0] < NUM_RECORDS){
    //insert records
    insertRecords();
  }
});

function insertDomains(cb){
  db.cypher({
    query: `WITH ["questionablexboxrepair.com", "totallylegit.co.nz", "notavirus.co.uk", "mrrobot.ninja", "freeviagra.net"] as domains
    FOREACH (r in range(0,999) |
    CREATE(:Domain {id:r, name:r+"."+domains[r % size(domains)]}))`
  }, cb);

}

function insertIPs(domains, cb){
  db.cypher({
    query: `WITH ["123.456.789", "987.567.123", "908.123.654", "098.123.321", "098.432.123"] as ips
    FOREACH (r in range(0,999) |
    CREATE(:IP {id:r, address:ips[r % size(ips)]+"."+r}))`
  }, cb);

}

function buildRelationships(ips, cb){
  db.cypher({
    query: `MATCH (d:Domain),(ip:IP)
    WITH d,ip
    LIMIT ${NUM_RECORDS}
    WHERE rand() < 0.1
    CREATE (d)-[:HAS]->(ip)`,
  }, cb);

}

function insertRecords(){
  async.waterfall([insertDomains, insertIPs, buildRelationships], function(err, results){
    if(err){
      console.log(err);
      return process.exit(1);
    }
    console.log(results);
    return process.exit(0);
  });
}
