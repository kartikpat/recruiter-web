function fetchDashboardStats(){
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/dashboard", {}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedDashboardStats", res.data);
		}
	});
}
