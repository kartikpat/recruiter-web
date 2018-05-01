function fetchRecruiterCredits(recruiterId){
	console.log(recruiterId)
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/recruiters", {}, function(res){
		if(res.status && res.status =='success') {
			return pubsub.publish("fetchedCredits", res);
		}

    }, function(res,status,error) {
	    return pubsub.publish("failedToFetchCredits", res);
	});
}