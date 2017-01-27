var AWS = require("aws-sdk");
var INDEX_TEMPLATE = "UponSubmission.ejs";
AWS.config.loadFromPath('./config.json');
var sqs = new AWS.SQS();


var task =  function(request, callback){

	var SQSlink ="https://sqs.us-west-2.amazonaws.com/983680736795/SokolowskiSQS";








var MessageNumber;
 var paramsMessNum = {
  AttributeNames: [
     "ApproximateNumberOfMessages"
  ], 
  QueueUrl: SQSlink
 };
 sqs.getQueueAttributes(paramsMessNum, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else {
   		MessageNumber=data.Attributes.ApproximateNumberOfMessages;
   		console.log(data.Attributes.ApproximateNumberOfMessages);
   		callback(null, {template:INDEX_TEMPLATE, params:{SQSlink:SQSlink, MessageNumber:MessageNumber}});
   }            // successful response
   
 });


}

exports.action = task