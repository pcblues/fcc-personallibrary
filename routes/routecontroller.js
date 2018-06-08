var url = process.env.DB
var dbName = 'fcc-personallibrary'
var collName = 'books'
var mongo=require('mongodb').MongoClient
var {ObjectId} = require('mongodb')
var populateNewRec=function(req) {
    var newRec ={}
    newRec.title = req.body.title
    newRec.commentcount=0
    newRec.comments=[]
    return newRec
}


exports.get = function(req,res){
  console.log('using get')
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    // collect params for search
  
  mongo.connect(url,function(err,db) {
  if (err) {res.send(JSON.stringify(err))
  } else {

    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    coll.find({}).toArray(function(err,docs){
      if (err) {res.send(JSON.stringify(err))
      }  else {
        res.send(docs)
      }
      db.close()
    })
  }
})
}
 
exports.post = function(req,res){
  console.log('using post')
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
  //console.log(title)
  var newRec = populateNewRec(req)
  //console.log(newRec)
  if (newRec.title=='' || newRec.title == undefined){
    res.send('title missing')
  } else {
  mongo.connect(url,function(err,db) {
  if (err) {
  console.log(err)
    res.send(JSON.stringify(err))
  } else {
    //console.log(db)
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    
    coll.insert(newRec,function(err,data) {
    if (err) {
      console.log('Error:'+err)
    } 
    
    db.close()
    res.send(newRec)
    })
  }
  })
  }}


exports.delete = function(req,res){
    console.log('using delete')
      //if successful response will be 'complete delete successful'    
    mongo.connect(url,function(err,db) {
    if (err) {
      res.send(JSON.stringify(err))
    } else {
      //console.log(db)
      var dbo=db.db(dbName)
      var coll = dbo.collection(collName)
      coll.remove({},function(err,data){
        if (err ) {
          console.log('Error:'+err)
          res.send('error deleting all records')
        } else {
          res.send('complete delete successful')
        }
      db.close()    
    })
    }   
  })
  }



exports.getid = function(req,res){
  console.log('using getid')
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    // collect params for search
  if (bookid==undefined || bookid=='') {
  res.send('no book exists')
  } else {
  bookid=extractID(bookid)
  mongo.connect(url,function(err,db) {
  if (err) {res.send(JSON.stringify(err))
  } else {

    var dbo=db.db(dbName)
    var coll = dbo.collection(collName) 
    coll.find({_id:ObjectId(bookid)}).toArray(function(err,docs){
      if (err) {res.send(JSON.stringify(err))
      }  else {
        if (docs.length==0) {
        res.send('no book exists')
        } else {
        
        res.send(docs[0])
      }
      }
      db.close()
    }) 
  }
})
}
}



exports.postid = function(req,res){
  console.log('using postid')
     var bookid = req.params.id;
    var comment = req.body.comment;
  if (bookid==undefined || bookid=='') {
  res.send('no book exists')
  } else {
  
  
  bookid=extractID(bookid)
  var newRec = populateNewRec(req)
  //console.log(newRec)
  mongo.connect(url,function(err,db) {
  if (err) {
    console.log(err)
    res.send(JSON.stringify(err))
  } else {
    
    //console.log(db)
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    coll.find({_id:ObjectId(bookid)}).toArray(function(err,docs){
      if (err) {res.send(JSON.stringify(err))
      }  else {
        docs[0].comments.push({comment:comment})
        docs[0].commentcount=docs[0].comments.length
      }   
  
    coll.update({_id:ObjectId(bookid)},docs[0],function(err,count) {
      
      //console.log(count)

      if (err ) {
        console.log('Error:'+err)
        res.send('could not update '+bookid)
      } else if (count.n==0) {
        res.send('id not found '+bookid)
  
      } else {
        //console.log('Rec:'+JSON.stringify(newRec))
        res.send('successfully updated')
      }
      db.close()      
  })
    })
  }
  
}  
    )}
}

function extractID(bookid) {
  var newBookID = bookid
  
  if (bookid[0]=='{') {
    newBookID=bookid.substring(1,bookid.length-1)
  }
  console.log('Old bookid:'+bookid+' New bookid:'+newBookID)
  return newBookID
}
 

exports.deleteid = function(req,res){
  console.log('using deleteid')
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    if (req.body._id=='' || req.body._id==undefined) {
    res.send('_id error')
  } else {
    bookid=extractID(bookid)
    mongo.connect(url,function(err,db) {
    if (err) {
      res.send(JSON.stringify(err))
    } else {
      //console.log(db)
      var dbo=db.db(dbName)
      var coll = dbo.collection(collName)
      coll.remove({_id:ObjectId(req.body._id)},function(err,data){
        if (err ) {
          console.log('Error:'+err)
          res.send('error updating '+req.body._id)
        } else if (data.result.n==0) {
          console.log(data)
          res.send('no book exists')
        } else {
          res.send('delete successful')
        }
      db.close()    
    })
    }   
  })
  }

}