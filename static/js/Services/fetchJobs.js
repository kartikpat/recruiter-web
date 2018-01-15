function fetchJobs(type){
	if(!type)
		type='all';
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs", {type: type}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedJobs:"+type, res.data);
		}
	});
}
