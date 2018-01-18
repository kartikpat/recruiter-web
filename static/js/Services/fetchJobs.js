function fetchJobs(type){
	var sampleData = {
    "data": [
        {
            "id": 464769,
            "publishedId": 442965,
            "uid": 45058,
            "loc": "Delhi",
            "min": 4,
            "max": 10,
            "min_sal": 0,
            "max_sal": 0,
            "title": "Senior Product Manager (4-10 yrs)",
            "catid": 13,
            "created": "2018-01-12T05:47:51.000Z",
            "rej": 0,
            "rej_msg": "",
            "l_updated": 0,
            "premium": 0,
            "timestamp": 1515736141,
            "cnfi": 0,
            "totalApplications": 5,
            "newApplications": 5
        }
    ],
    "status": "success"
}
	return pubsub.publish("fetchedJobs:"+type, sampleData.data);
	if(!type)
		type='all';
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs", {type: type}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedJobs:"+type, res.data);
		}
	});
}
