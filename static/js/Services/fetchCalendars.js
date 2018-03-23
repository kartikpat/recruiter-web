function fetchCalendars(jobId, recruiterId){
	console.log(jobId,recruiterId);
	console.log();
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/calendar/"+jobId, {}, function(res){
		console.log(res);
		if(res.status && res.status =='success'){
			console.log(res.data);
			return pubsub.publish("fetchedCalendars",res.data);
		}
		return pubsub.publish("failedToFetchCalendars", res);
	});
}
