function submitRefreshJob(recruiterId, jobId){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+'/action/refresh',{
		"Content-Type": "application/json",
	},{}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("jobRefreshSuccess", res);
		}

	},function(res,status,error) {
		debugger
		return pubsub.publish("jobRefreshFail", res);
	});
}
