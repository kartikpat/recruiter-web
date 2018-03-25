function submitEditJob(recruiterId,jobId,data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId,{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("jobEdited", res);
		}
	},function(res,status,error) {
		return pubsub.publish("failedEditJobSubmission", res);
	});
}
