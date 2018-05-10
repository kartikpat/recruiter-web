function fetchRecruiterResume(recruiterId){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/bulk-downloads",{},function(res){
        if(res.status && res.status =='success'){
			return pubsub.publish("fetchResumeSuccess",res);
		}
	},function(res,status,error){
        return pubsub.publish("fetchResumeFail", res);
    });
}