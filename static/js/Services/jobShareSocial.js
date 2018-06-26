function jobShareSocial(recruiterId,jobId,data){
    console.log(data);
	postRequest("/recruiter/"+recruiterId+"/job/"+jobId+"/share",null,data,function(res, status, xhr){
        if(res.status && res.status =='success'){
            return pubsub.publish("socialShareSuccess", res);
        }
    },function(res,status,error){ 
        return pubsub.publish("socialSharefail", res);
	});
}
