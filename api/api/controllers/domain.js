let db = require('./../helpers/DB.js');
let QueryBuilder = require('./../helpers/QueryBuilder.js');
const _ = require('lodash');

module.exports = {
  listDomains: function(req, res, next){
    let query = `MATCH (d:Domain)\n`;
    if(req.swagger.params.filter.value){
      query+= `\nWHERE d.name =~{filter}\n`;
    }
    query+=`RETURN d`;
    query+=QueryBuilder(req);

    db.cypher({
      query: query,
      params: {
        filter: `.*${req.swagger.params.filter.value}.*`
      }
    }, (err, results)=>{
      if(err) return next(err);
      results = results.map(function(item){
        return item.d.properties.id;
      });
      res.send(results);
    });
  },
  retrieveDomain: function(req, res, next){
    let depth = 2;
    if(req.swagger.params.depth && req.swagger.params.depth.value) depth = req.swagger.params.depth.value;
    depth = Number(depth);

    let query = `MATCH (d:Domain{id:'${req.swagger.params.domain_name.value}'})
    OPTIONAL MATCH p=(d)-[r:HAS*1..${depth}]-(c)
    RETURN d.id as source, collect(distinct c.id) as nodes, collect(distinct {source: d.id, target: c.id}) as links`;

    db.cypher({
      query: query,
      lean: true
    }, (err, results)=>{
      if(err || !results.length) return next(err);
      results = results[0];
      results.nodes.push(results.source);
      results.source = null;
      delete results.source;
      results.nodes = results.nodes.map((node, index)=>{
        return {id:node, group: index};
      });
      results.links = results.links.map((link)=>{
        link.value = 1;
        return link;
      });
      results.links = results.links.filter((link)=>{
        return link.source && link.target;
      });

      res.send(results);
    });
  }
};
