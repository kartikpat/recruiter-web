function setDefaultCalendar(recruiterId, jobId, calendarId, data, parameters){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/calendar/"+calendarId, null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			res.parameters = parameters;
			return pubsub.publish("setDefaultCalendarSuccess", res);
		}
	}, function(res){
		return pubsub.publish("setDefaultCalendarFail", res.responseJSON);
	});
}
