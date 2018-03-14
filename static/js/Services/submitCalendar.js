function submitCalendar(data, recruiterId){
	//console.log(data);
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/",{
		"Content-Type": "application/json",
	}, JSON.stringify(data), function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("submittedCalendar", res);
		}
		return pubsub.publish("failedCalendarSubmission", res);
	});
}
