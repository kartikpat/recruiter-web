function fetchRecruiterReports(recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/reports", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchReportsSuccess", res.data);
		}
		return pubsub.publish("fetchReportsFail", res);
	});
}
