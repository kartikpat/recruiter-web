function fetchRecruiterReports(recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/reports", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchReportsSuccess", res.data);
		}

	}, function(res,status,error) {
	    return pubsub.publish("fetchReportsFail", res);
	});
}
