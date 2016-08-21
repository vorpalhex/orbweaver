let db = require('./../helpers/DB.js'); //let this handle our DB setup, reconnects, errors, etc
let QueryBuilder = require('./../helpers/QueryBuilder.js'); //let this always give us LIMIT and if need be SKIP
const _ = require('lodash'); //lodash for life

module.exports = {
  /*
   * Retrieve an array of domain names, potentially filtered by some string
   */
  listDomains: function(req, res, next){
    let query = `MATCH (d:Domain)\n`;
    if(req.swagger.params.filter.value){
      /*
       * We should be using a parameter here instead of templating, but node-neo4j does *NOT* like regex params
       * like, not even a tiny bit.
       */
      query+= `\nWHERE d.name =~.*${req.swagger.params.filter.value}.*\n`;
    }
    query+=`RETURN d`;
    query+=QueryBuilder(req); //supplies SKIP and LIMIT as need be, always has a LIMIT

    db.cypher({
      query: query
    }, (err, results)=>{
      if(err) return next(err);
      results = results.map(function(item){ //we *just* need our id
        return item.d.properties.id;
      });
      res.send(results);
    });
  },
  /*
   * Retrieve a single domain and it's path to other nodes within some depth
   * Returning only the top layer (end nodes) to keep our payload small and our rendering quick
   */
  retrieveDomain: function(req, res, next){
    let depth = 2;
    if(req.swagger.params.depth.value) depth = req.swagger.params.depth.value;
    depth = Number(depth); //depth should be a number

    /*
     * Again, we're plagued by node-neo4j not correctly handling params in a variety of cases
     * especially of note here is DEPTH which gives us a hard crash
     */
    let query = `MATCH (d:Domain{id:'${req.swagger.params.domain_name.value}'})
    OPTIONAL MATCH p=(d)-[r:HAS*1..${depth}]-(c)
    RETURN d.id as source, collect(distinct c.id) as nodes, collect(distinct {source: d.id, target: c.id}) as links`;

    db.cypher({
      query: query,
      lean: true
    }, (err, results)=>{
      if(err || !results.length) return next(err);
      results = results[0]; //dive into our top level
      results.nodes.push(results.source); //include our source node, otherwise d3 will crash
      results.source = null; //we can remove our source now
      delete results.source;
      results.nodes = results.nodes.map((node, index)=>{ //remap nodes
        return {id:node, group: index};
      });
      results.links = results.links.map((link)=>{ //make sure all of our links have values
        link.value = 1; //could pull the full path and make this be path.length
        return link;
      });
      results.links = results.links.filter((link)=>{ //filter out any half empty links
        return link.source && link.target;
      });

      res.send(results); 
    });
  }
};
