function fetchDashboardStats(recruiterId){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/dashboard", {}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedDashboardStats", res.data);
		}
	});
}
