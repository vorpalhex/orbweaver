let db = require('./../helpers/DB.js');
let QueryBuilder = require('./../helpers/QueryBuilder.js');

module.exports = {
  listDomains: function(req, res, next){
    let query = `MATCH (d:Domain)\n`;
    if(req.swagger.params.filter.value){
      query+= `\nWHERE d.name =~ '.*{filter}.*'\n`;
    }
    query+=`RETURN d\n`;
    query+=QueryBuilder(req);
    console.log(query);
    db.cypher({
      query: query,
      parameters: {
        filter: req.swagger.params.filter.value
      }
    }, function(err, results){
      if(err) return next(err);
      res.send(results);
    });
  },
  retrieveDomain: function(req, res, next){
    let query = `MATCH (d:Domain{name:'{name}'})
    RETURN d`;

    console.log(query, req.swagger.params.domain_name.value);

    db.cypher({
      query: query,
      parameters: {
        name: req.swagger.params.domain_name.value
      }
    }, function(err, results){
      if(err) return next(err);
      res.send(results);
    });
  }
};
