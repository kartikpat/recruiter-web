function fetchCalendarsIe(calendarId, recruiterId){
	return getRequest(baseUrl_local+"/recruiter/"+recruiterId+"/calendar/"+calendarId, {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedCalendarsIe",res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedToFetchCalendarsIe", res);
	});
}
