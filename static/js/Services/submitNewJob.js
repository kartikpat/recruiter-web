function submitNewJob(data, recruiterId){
	console.log(data);
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job",{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("submittedNewJob", res);
		}
		return pubsub.publish("failedNewJobSubmission", res);
	});
}
