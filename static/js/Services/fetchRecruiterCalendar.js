function fetchRecruiterCalendar(recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/calendar", {}, function(res){
		if(res.status && res.status =='success') {
			return pubsub.publish("fetchedCalendars", res);
		}
		return pubsub.publish("failedToFetchCalendars", res);
    });
}

