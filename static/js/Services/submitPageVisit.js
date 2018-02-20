function submitPageVisit(recruiterId, screenName, jobId){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/visit", null, {
		screen: screenName,
		jobId: jobId
	}, function(res, status, xhr){
		console.log(xhr)
		if(res.status && res.status =='success'){
			return pubsub.publish("pageVisitSuccess:"+screenName, res.data);
		}
	}, function(res){
		return pubsub.publish("pageVisitFail:"+screenName, res);
	});
}
