function submitPremiumJob(recruiterId, jobId){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+'/action/premium',{
		"Content-Type": "application/json",
	}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("jobPremiumSuccess", res);
		}
		return pubsub.publish("jobPremiumFail", res);
	});
}
