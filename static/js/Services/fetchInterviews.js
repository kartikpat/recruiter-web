
function fetchInterviews(recruiterId, parameters){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/interviews",parameters, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedInterviews", res.data);
		}
        return pubsub.publish("fetchedInterviewsFail", res);
	});
}
