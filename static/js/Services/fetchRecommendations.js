function fetchRecommendations(parameters, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/applications", parameters, function(res){
		if(res.status && res.status =='success') {
			return pubsub.publish("fetchRecommendationsSuccess", res);
		}
	}, function(res,status,error) {
	    return pubsub.publish("fetchRecommendationsFail", res);
	});
}
