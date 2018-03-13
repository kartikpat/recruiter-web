function fetchJobTags(recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobtags", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJobTags", res.data);
		}
        return pubsub.publish("failToFetchJobTags", res.responseJSON);
	});
}
