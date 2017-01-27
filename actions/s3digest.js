var AWS = require("aws-sdk");
var INDEX_TEMPLATE = "UponUpload.ejs";

AWS.config.loadFromPath('./config.json');

var task =  function(request, callback){
	var bucket = request.query.bucket;
	var key = request.query.key;

	callback(null, {template:INDEX_TEMPLATE, params:{bucket:bucket, key:key}}); 
}

exports.action = task