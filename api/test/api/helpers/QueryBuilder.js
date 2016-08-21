var should = require('should');
var QueryBuilder = require('../../../api/helpers/QueryBuilder.js');

var mockReq = {
  swagger: {
    params: {
      limit: {
        value: null
      },
      skip: {
        value: null
      }
    }
  }
};

describe('QueryBuilder', function() {
  it('should return a default LIMIT query', function() {
    var query = QueryBuilder(mockReq);
    should.exist(query);
    should(query).containEql('LIMIT');
  });
  it('should return a query with LIMIT and SKIP', function() {
    mockReq.swagger.params.limit.value = 5;
    mockReq.swagger.params.skip.value = 10;
    var query = QueryBuilder(mockReq);
    should.exist(query);
    should(query).containEql('LIMIT 5');
    should(query).containEql('SKIP 10');
  });
});
