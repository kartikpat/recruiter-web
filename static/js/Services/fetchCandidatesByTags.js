function fetchCandidatesByTags(parameters, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/tagged-candidates", parameters, function(res){
		if(res.status && res.status =='success') {
			res.obj = {}
			res.obj.pageNumber = parameters.pageNumber;
			return pubsub.publish("fetchCandidatesByTagsSuccess", res);
		}

	}, function(res,status,error) {
	    return pubsub.publish("fetchCandidatesByTagsFail", res);
	});
}
