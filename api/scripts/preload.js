/*
 * Preload in some random test data
 * This is run on 'npm start' and should be idempotent
 */
const _ = require('lodash');
const async = require('async');
const neo4j = require('neo4j');
let db = new neo4j.GraphDatabase('http://localhost:7474');

const NUM_RECORDS = 3000;

//check to see if our record count matches what we expect
db.cypher({
  query: `MATCH (d:Domain)-[h:IP]-(ip) WITH count(ip) as ipCount RETURN ipCount`
}, function(err, results){
  if(results.length < 1 || results[0] < NUM_RECORDS){
    //insert records
    console.log('Inserting Records');
    insertRecords();
  }else{
    console.log('Already have records, not inserting...');
  }
});

/*
 * Take a few base domains, semi-randomly generate subdomains of them
 */
function insertDomains(cb){
  db.cypher({
    query: `WITH ["questionablexboxrepair.com", "totallylegit.co.nz", "notavirus.co.uk", "mrrobot.ninja", "freeviagra.net"] as domains
    FOREACH (r in range(0,${Math.floor(NUM_RECORDS/3)}) |
    CREATE(:Domain {id:r+"."+domains[r % size(domains)]}))`
  }, cb);

}

/*
 * Start with the first three segments of an ip, then add on from 0-999 using modulo
 * giving us an equal distribution across our base
 */
function insertIPs(domains, cb){
  db.cypher({
    query: `WITH ["123.456.789", "987.567.123", "908.123.654", "098.123.321", "098.432.123"] as ips
    FOREACH (r in range(0,999) |
    CREATE(:IP {id:ips[r % size(ips)]+"."+r}))`
  }, cb);

}

/*
 * Add a relationship in about 30% of cases randomly
 */
function buildRelationships(ips, cb){
  db.cypher({
    query: `MATCH (d:Domain),(ip:IP)
    WITH d,ip
    LIMIT ${NUM_RECORDS}
    WHERE rand() < 0.3
    CREATE (d)-[:HAS]->(ip)`,
  }, cb);

}
/*
 * Use waterfall pattern to coordinate our functions, return back an error code if something broke
 */
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
