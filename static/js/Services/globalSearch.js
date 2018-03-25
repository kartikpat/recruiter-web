function globalSearch(recruiterId,params){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/search", params, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedSearch", res);
		}

	}, function(res,status,error) {
	    return pubsub.publish("fetchedFailSearch", res);
	});
}
