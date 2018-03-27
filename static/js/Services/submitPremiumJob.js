function submitPremiumJob(recruiterId, jobId){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+'/action/premium',{
		"Content-Type": "application/json",
	}, {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("jobPremiumSuccess", res);
		}

	},function(res,status,error) {
		return pubsub.publish("jobPremiumFail", res);
	});
}
