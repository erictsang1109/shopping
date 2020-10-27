var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbName = "shopping";
// MongoClient.connect(url, {
// 		useNewUrlParser: true
// 	}, function(err, db) {
// 		if (err) throw err;
// 		var dbo = db.db(dbName);
// 		dbo.collection("goods").find().toArray(function(err, result) { // Return all data in the collection
// 			if (err) throw err;
// 			console.log(result);
// 		//	res.end(JSON.stringify(result));
// 			db.close();
// 		});
// 	});
	
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(dbName);
	  var userid="4186dc64-40d6-0dde-0d30-90dfda58405c";
	  dbo.collection('goods').aggregate([
	    { $lookup:
	       {
	         from: 'favorites',            // Right set
	         localField: 'goodsid',    // Join fields on the left set
	         foreignField: 'goodsid',         // Join fields on the right set
	         as: 'collectA'           // Newly generated field (type array)
	       }
	     }
	    ]).toArray(function(err, result) {
	    if (err) throw err;
		var resultArr=[];
		for(var i=0;i<result.length;i++)
		{
			var collectA = result[i].collectA;
			console.log('collectA.length:'+collectA.length);
			if(collectA.length<=0)
			{
				result[i].isCollect=false;
				delete result[i].collectA;
				resultArr.push(result[i]);
				continue;
			}
			var isCollect =false;
			for(var j=0;i<collectA.length;j++)
			{
				console.log('collectA[j].userid:'+collectA[j].userid);
				if(collectA[j].userid==userid)
				{
					isCollect = true;
					break;
				}
			}
			result[i].isCollect=isCollect;
			delete result[i].collectA;
			resultArr.push(result[i]);
		}
		console.log(resultArr);
	    db.close();
	  });
	});