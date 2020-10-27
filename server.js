var http = require('http');
var path = require('path');
var fs = require("fs");
var mime = require("mime");
var urlH = require("url");
var qs = require('querystring');
var formidable = require('formidable');
var MongoClient = require('mongodb').MongoClient;
var dburl = "mongodb://localhost:27017/";
var dbName = "shopping";
http.createServer(function(req, res) {

	res.render = function(filename) {
		fs.readFile(filename, function(err, data) {
			if (err) {
				res.writeHead(404);
				res.write("Not Found!");
			} else {
				res.setHeader('Content-Type', mime.getType(filename));
				res.write(data);
			}
			res.end();
		});
	}
	var url = req.url;
	var method = req.method.toLowerCase();
	console.log("url:"+url+",method:"+method);
	if (url.startsWith("/login")) {
		if (method === 'get') {
			res.render(path.join(__dirname, 'html', 'login.html'));
		} else if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				var username = postBody.username;
				var password = postBody.password;
				console.log(postBody);
				findUserByInfo(postBody, res);
			});
		}
	} else if (url.startsWith("/regist")) {
		if(method === 'get')
		{
			res.render(path.join(__dirname, 'html', 'regist.html'));
		}else if(method === 'post')
		{
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8");
				postBody = qs.parse(postBody);
				regist(postBody, res);
			});
		}
	}else if (url.startsWith("/forgetpassword")) {
		if(method === 'get')
		{
			res.render(path.join(__dirname, 'html', 'forgetpassword.html'));
		}
	}else if (url.startsWith("/main")) {
		if(method === 'get')
		{
			res.render(path.join(__dirname, 'html', 'main.html'));
		}
	}else if (url.startsWith("/findByUsername")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				findUserByUserName(postBody, res);
			});
		}
	}else if (url.startsWith("/findByUserBynamePhone")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				findUserByUserNameAndPhone(postBody, res);
			});
		}
	}else if(url.startsWith("/updateUser") && method === 'put')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			// var data = { name: postBody.name,_id:postBody._id};
			console.log(postBody);
			updateUser(postBody, res);
		});
	
	}
	else if (url.startsWith("/newGoods") && method === 'post') {
		var form = new formidable.IncomingForm();
		var targetFile = path.join(__dirname, './resources/img');
		form.uploadDir = targetFile;
		form.parse(req, function(err, fields, files) {
			if (err) throw err;
			var oldpath = files.newImage.path;
			var newpath = path.join(path.dirname(oldpath), files.newImage.name);
			fs.rename(oldpath, newpath, (err) => {
				if (err) throw err;
				var imgSrc = "/resources/img/" + files.newImage.name;
				var data = {
					name: fields.name,
					desc: fields.desc,
					imgSrc: imgSrc,
					price: fields.price,
					userid:fields.userid
				};
				insertnewGoods(data, res);
			})
		});
		
		
		
	}else if(url.startsWith("/updateGoods") && method === 'put') {
		var form = new formidable.IncomingForm();
		var targetFile = path.join(__dirname, './resources/img');
		form.uploadDir = targetFile;
		form.parse(req, function(err, fields, files) {
			if (err) throw err;
			var oldpath = files.newImage.path;
			var newpath = path.join(path.dirname(oldpath), files.newImage.name);
			fs.rename(oldpath, newpath, (err) => {
				if (err) throw err;
				var imgSrc = "/resources/img/" + files.newImage.name;
				var data = {
					name: fields.name,
					desc: fields.desc,
					imgSrc: imgSrc,
					goodsid:fields.goodsid,
					price: fields.price,
					userid:fields.userid
				};
				console.log(data)
				updateGoods(data, res);
			})
		});
		
		
		
	}
	
	else if (url.startsWith("/addFavicate") && method === 'post') {
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { goodsid: postBody.goodsid,userid:postBody.userid};
			console.log(data);
			addFavicate(data, res);
		});
		
	}
	
	
	
	else if (url.startsWith("/findGoods") && method === 'post') {
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			findGoods(postBody, res);
		});
	}else if (url.startsWith("/findFavicate") && method === 'post') {
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = {userid:postBody.userid};
			console.log(data);
			findFavicate(data, res);
		});
	} else if(url.startsWith("/deleteGoods") && method === 'delete')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { goodsid: postBody.goodsid};
			console.log(data);
			deleteGoods(data, res);
		});
	
	}
	 
	else if(url.startsWith("/deletFav") && method === 'delete')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { uuid: postBody.uuid};
			console.log(data);
			deletFav(data, res);
		});
	
	}else if(url.startsWith("/canceFav") && method === 'delete')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			canceFav(postBody, res);
		});
	
	}
	
	
	
	else if (url.startsWith("/resources") && method === 'get') {
		res.render(path.join(__dirname, url));
	}else {
		console.log("Requested URL is: " + req.url);
		res.end();
	}
}).listen(8964, function() {
	console.log("Start Services");
})

function regist(data, res) {
	data.uuid=guid();
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		dbo.collection("users").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}
function findUserByInfo(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var whereStr = {
			"username": data.username,
			'password': data.password
		};
		dbo.collection("users").find(whereStr).toArray(function(err, result) { // Return all data in the collection
			if (err) throw err;
			if (result.length == 1) {
				res.end(result[0].uuid);
			} else {
				res.end("error");
			}
			db.close();
		});
	});
}
function updateUser(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
	    var whereStr = {"username":data.username};  // Query conditions
	    var updateStr = {$set: { "password" : data.password }};
	    dbo.collection("users").updateOne(whereStr, updateStr, function(err, obj) {
	       if (err) throw err;
	       res.end("success");
	       db.close();
	    });
	});
}
function findUserByUserName(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var whereStr = {
			"username": data.username
		};
		dbo.collection("users").find(whereStr).toArray(function(err, result) { // Return all data in the collection
			if (err) throw err;
			// console.log(result)
			if (result.length <= 0) {
				res.end("success");
			} else {
				res.end("error");
			}
			db.close();
		});
	});
}
function findUserByUserNameAndPhone(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var whereStr = {
			"username": data.username,
			"phone":data.phone
		};
		console.log("whereStr"+whereStr)
		dbo.collection("users").find(whereStr).toArray(function(err, result) { // Return all data in the collection
			if (err) throw err;
			// console.log(result)
			if (result.length == 1) {
				res.end("success");
			} else {
				res.end("error");
			}
			db.close();
		});
	});
}


function insertnewGoods(data, res) {
	var uuid=guid();
	data.goodsid=uuid;
	data.collectionid=uuid+data.userid;
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		dbo.collection("goods").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}
function addFavicate(data, res) {
	var uuid=guid();
	data.uuid=uuid;
	data.collectionid=data.goodsid+data.userid;
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		dbo.collection("favorites").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}
function guid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function findGoods(data,res) {
	var userid=data.userid;
	var team=data.term;
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db(dbName);
		  dbo.collection('goods').aggregate([
		    { $lookup:
		       {
		         from: 'favorites',            // Right set
		         localField: 'goodsid',    // Join fields on the left set
		         foreignField: 'goodsid',         //Join fields on the right set
		         as: 'collectA'           // Newly generated field (type array)
		       }
		     }
		    ]).toArray(function(err, result) {
		    if (err) throw err;
			var resultArr=[];
			for(var i=0;i<result.length;i++)
			{
				var collectA = result[i].collectA;
				if(team!='' && result[i].name.indexOf(team)<0)
				{
					continue;
				}
				console.log('collectA.length:'+collectA.length);
				if(collectA.length<=0)
				{
					result[i].isCollect=false;
					delete result[i].collectA;
					resultArr.push(result[i]);
					continue;
				}
				console.log('12321');
				var isCollect =false;
				for(var j=0;j<collectA.length;j++)
				{
				
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
			res.end(JSON.stringify(resultArr));
		    db.close();
		  });
		});
}
function findFavicate(data,res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	  if (err) throw err;
	  var userid = data.userid;
	  var dbo = db.db(dbName);
	  dbo.collection('favorites').aggregate([
	    { $lookup:
	       {
	         from: 'goods',            // Right set
	         localField: 'goodsid',    // Join fields on the left set
	         foreignField: 'goodsid',         // Join fields on the right set
	         as: 'goodsInfo'           // Newly generated field (type array)
	       }
	     }
	    ]).toArray(function(err, result) {
	    if (err) throw err;
		var arr = [];
		for (var i=0;i<result.length;i++)
		{
			if(result[i].userid==userid)
			{
				arr.push(result[i])
			}
		}
		res.end(JSON.stringify(arr));
	    db.close();
	  });
	});
}

function deleteGoods(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
		var data1 = {'goodsid':data.goodsid};
		console.log(data1)
	    dbo.collection("goods").deleteOne(data1, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});
}

function deletFav(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
		var data1 = {'uuid':data.uuid};
		console.log(data1)
	    dbo.collection("favorites").deleteOne(data1, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});
}
function canceFav(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
		var data1 = {'userid':data.userid,'goodsid':data.goodsid};
		console.log(data1)
	    dbo.collection("favorites").deleteOne(data1, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});
}

function updateGoods(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
	    var whereStr = {"goodsid":data.goodsid};  // Query conditions
		console.log(whereStr)
		var updata = {
			name: data.name,
			desc: data.desc,
			imgSrc: data.imgSrc,
			price: data.price
		};
	    var updateStr = {$set: updata};
		console.log(updata)
	    dbo.collection("goods").updateOne(whereStr, updateStr, function(err, obj) {
	       if (err) throw err;
	       res.end("success");
	       db.close();
	    });
	});
}