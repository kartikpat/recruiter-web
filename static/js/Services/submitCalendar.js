function submitCalendar(data,calendarId,recruiterId){
	console.log(data);
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/calendar/"+calendarId,{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		debugger
		if(res.status && res.status =='success'){
			return pubsub.publish("submittedCalendar", res);
		}
		return pubsub.publish("failedCalendarSubmission", res);
	});
}
