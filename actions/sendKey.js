var AWS = require("aws-sdk");
var INDEX_TEMPLATE = "UponSubmission.ejs";
AWS.config.loadFromPath('./config.json');
var sqs = new AWS.SQS();

var task =  function(request, callback){

	var SQSlink ="https://sqs.us-west-2.amazonaws.com/983680736795/SokolowskiSQS";
	var message = request.body.Message?request.body.Message:"missing Message";
	var algorithms = request.body.loop ? request.body.loop : [];

	console.log("----------------------------------------");
	console.log(message);
	console.log(algorithms);
	var params = {
		DelaySeconds: 10, 
		MessageAttributes: {
			"FileNames": {
				DataType: "String", 
				StringValue: message
			}
		}, 
		MessageBody: "Checked files", 
		QueueUrl: SQSlink
	};
	console.log("----------------------------------------");
	console.log(message);
	sqs.sendMessage(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     {
   console.log(data); 
   	
   }          // successful response
   /*
   data = {
    MD5OfMessageAttributes: "00484c68...59e48f06", 
    MD5OfMessageBody: "51b0a325...39163aa0", 
    MessageId: "da68f62c-0c07-4bee-bf5f-7e856EXAMPLE"
   }
   */
});


callback(null, null);

	

}

exports.action = task