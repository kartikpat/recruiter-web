function fetchCalendars(calendarId, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/calendar/"+calendarId, {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedCalendars",res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedToFetchCalendars", res);
	});
}
