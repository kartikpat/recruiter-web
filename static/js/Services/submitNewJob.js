function submitNewJob(data){
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/job",null, data, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("submittedNewJob", res.data);
		}
		return pubsub.publish("failedNewJobSubmission", res.data);
	});
}
