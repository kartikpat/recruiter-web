function fetchCandidatesByStatus(parameters, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/applications", parameters, function(res){
		if(res.status && res.status =='success') {
			console.log(parameters)
			res.obj = {}
			res.obj.pageNumber = parameters.pageNumber;
			res.obj.status = parameters.status;
			return pubsub.publish("fetchCandidatesByStatusSuccess", res);
		}
		return pubsub.publish("fetchCandidatesByStatusFail", res.responseJSON);
	});
}
