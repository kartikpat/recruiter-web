function fetchJobs(type, recruiterId){
	console.log(type)
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs", {type: type}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedJobs:", res.data);
		}
	});
}
