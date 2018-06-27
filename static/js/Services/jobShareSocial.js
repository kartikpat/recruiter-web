function jobShareSocial(recruiterId,jobId,data){
	postRequest("/recruiter/"+recruiterId+"/job/"+jobId+"/share",null,data,function(res, status, xhr){
        console.log(res)
        if(res.status && res.status =='success'){
            return pubsub.publish("socialShareSuccess", res);
        }
        if(res.status=="fail"){
            return pubsub.publish("socialSharefail",res);     
        }
    })
};
