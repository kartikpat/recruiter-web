function fetchJobApplications(jobId,status){
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId+"/applications", {
        status: status
    }, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJobApplication:"+jobId, res);
		}
		return pubsub.publish("failedTofetchJobApplication:"+jobId, res);
	});
}
