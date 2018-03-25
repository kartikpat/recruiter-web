function submitNewJob(data, recruiterId){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job",{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("submittedNewJob", res);
		}
	},function(res,status,error) {
		return pubsub.publish("failedNewJobSubmission", res);
	});
}
