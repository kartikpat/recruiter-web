function submitUnpublishJob(recruiterId, jobId, data){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+'/action/unpublish',{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("jobUnpublishSuccess", res);
		}
		return pubsub.publish("jobUnpublishFail", res);
	});
}
