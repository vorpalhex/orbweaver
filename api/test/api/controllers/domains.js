var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('domain', function() {

    describe('GET /domains', function() {
      it('should return a default string', function(done) {
        request(server)
          .get('/domains')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            should.exist(res.body);
            done();
          });
      });

      it('should accept a limit parameter', function(done) {
        request(server)
          .get('/domain')
          .query({ limit: 5})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(5);
            done();
          });
      });

    });

    describe('GET /domain/:domain_name', function() {
      it('should return a default string', function(done) {
        request(server)
          .get('/domains/0.questionablexboxrepair.com')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            should.exist(res.body);
            should.exist(res.body.nodes);
            should.exist(res.body.links);
            done();
          });
      });
    });

  });
});
