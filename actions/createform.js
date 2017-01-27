var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS = require("aws-sdk");
//var os = require()
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";






var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	//4. get bucket name
	var fields = [];
	var bucketname = policy.getConditionValueByKey("bucket");
	
	var fields = s3Form.generateS3FormFields();

	var fields = s3Form.addS3CredientalsFields(fields, awsConfig);
	var files = [];


	var s3 = new AWS.S3();
	var autoscaling = new AWS.AutoScaling();
	var simpledb = new AWS.SimpleDB({apiVersion: '2009-04-15'});
	
	var domainName = 'Damian.Sokolowski.FormLogFile';

	var paramsCreateDomain = {
		DomainName: domainName /* required */
	};
	var paramsListDomains = {
		MaxNumberOfDomains: 100,
		NextToken: 'STRING_VALUE'
	};

	var paramsPutAttributes = {
		Attributes: [ /* required */
		{
			Name: 'Form invoked', /* required */
			Value: 'The Createform has been invoked', /* required */
			Replace: false
		},
		/* more items !!!!!!!! może time i content of table*/
		],
		DomainName: domainName,
		ItemName: 'Item', /* required */
  // Expected: {
  //   Exists: true || false,
  //   Name: 'STRING_VALUE',
  //   Value: 'STRING_VALUE'
  // }
};

var domains = [];
simpledb.listDomains(paramsListDomains, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else  {
	  // console.log(data);           // successful response
	  domains=data.DomainNames;
	  console.log("Domains uploaded for existence checks of   "+domainName+"   domain");
  	}
});

if (domains.indexOf(domainName) == -1){
			simpledb.createDomain(paramsCreateDomain, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     {
		  	console.log("- - - - - - - - - - - - - - - - - -");
		  	console.log("New domain created");  


				  	simpledb.putAttributes(paramsPutAttributes, function(err, data) {
				  if (err) console.log(err, err.stack); // an error occurred
				  else     {
				  console.log(data); 
				  console.log("- - - - - - - - - - - - - - - - - -");
				  console.log("New entry added to log file");
				  }         // successful response
				});
		  }         // successful response
		});
} else {
			simpledb.putAttributes(paramsPutAttributes, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     {
		  console.log(data); 
		  console.log("- - - - - - - - - - - - - - - - - -");
		  console.log("New entry added to log file");
		  }         // successful response
		});
}





var params = {
	Bucket: bucketname
};
s3.listObjects(params, function(err, data) {
	if (err) { 
		console.log(err, err.stack);
		callback(null, {template: INDEX_TEMPLATE, params:{fields:fields, bucket:bucketname, files:[{name: "Error"}]}});

	  } // an error occurred
	  else  {
	  	//
	  	var i=0;
	  	data.Contents.forEach( function(item){
	  		if (item.Key.startsWith("DSkubelek")) {
	  			var No = i++;
	  			var key = item.Key;
	  			var name = item.Key.substr(10);
	  			var url = "https://s3-"+awsConfig.region+".amazonaws.com/"+bucketname+"/"+encodeURIComponent(key);
	  			if (name != "") {
	  				files.push({key: key, name: name, url: url, No: No});
	  			}
	  		} 
	  	})
	  	console.log("- - - - - - - - - - - - - - - - - -");
		  console.log("Files uploaded to front-end");
	  	// console.log(files);






callback(null, {template: INDEX_TEMPLATE, params:{fields:fields, bucket:bucketname, files:files}});
	  }              // successful response
	});






}

exports.action = task;
