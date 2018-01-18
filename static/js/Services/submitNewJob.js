function submitNewJob(data){
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/job", data, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("submittedNewJob", res.data);
		}
		return pubsub.publish("failedNewJobSubmission", res.data);
	});
}
