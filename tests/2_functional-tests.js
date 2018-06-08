/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

 

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      var title='my test title'
      test('Test POST /api/books with title', function(done) {
     chai.request(server)
      .post('/api/books')
      .send({title:title})
       .end(function(err, res){
        assert.equal(res.status, 200);             
        assert.equal(res.body.title,title,'Title should be correct')
        assert.isDefined(res.body._id,'ID should be defined')
        done();
      });
});
      });
      test('Test POST /api/books with no title given', function(done) {
     chai.request(server)
      .post('/api/books')
      .send({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text,'title missing','New book needs a title')
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){      
      test('Test GET /api/books',  function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });      
      
    });
      });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
     chai.request(server)
      .get('/api/books/{5b1ac63ef830f00595b210ad}')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text,'no book exists')
        done();
      });
        });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        var id ='{5b1ac63efa30f00595b210ad}'
     chai.request(server)
      .get('/api/books/'+id)
      .end(function(err, res){
        assert.equal(res.status, 200);
       var respObj=res.body
       var idCheck = '5b1ac63efa30f00595b210ad'
        assert.equal(respObj._id,idCheck)
       done();
      });
      
    });
});

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
     var id = '{5b1ac63efa30f00595b210ad}'
     var comment='fdsa'
        chai.request(server)
      .post('/api/books/'+id)
      .send('{comment:'+comment+'}')
      .end(function(err, res){
        assert.equal(res.status, 200);
        var resp=res.text
        assert.equal(resp,'successfully updated')
        done();
      });
      
    });

  });
});
});
