/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var route = require('./routecontroller.js')

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      route.get(req,res)
    })
    
    .post(function (req, res){
    route.post(req,res)  
  })
    
    .delete(function(req, res){
    route.delete(req,res)  
  });



  app.route('/api/books/:id')
    .get(function (req, res){
      route.getid(req,res)
    })
    
    .post(function(req, res){
      route.postid(req,res)
    })
    
    .delete(function(req, res){
      route.deleteid(req,res)
    });
  
};
