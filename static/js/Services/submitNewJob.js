function submitNewJob(data){
	console.log(data);
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/job",{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("submittedNewJob", res.data);
		}
		return pubsub.publish("failedNewJobSubmission", res.data);
	});
}
