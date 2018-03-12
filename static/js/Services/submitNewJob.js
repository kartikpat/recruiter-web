function submitNewJob(data, recruiterId){
	console.log(data);
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job",{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		if(res.status && res.status =='success'){
			debugger
			return pubsub.publish("submittedNewJob", res);
		}
		debugger
		return pubsub.publish("failedNewJobSubmission", res);
	});
}
