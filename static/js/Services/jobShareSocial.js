function jobShareSocial(recruiterId,jobId,data){
    postRequest("/recruiter/"+recruiterId+"/job/"+jobId+"/share",null,data,function(res, status, xhr){
        res.platform=data;
        if(res.status && res.status =='success'){
            return pubsub.publish("socialShareSuccess", res);
        }
        
    },function(res,status,error) {
        res.data=data;
        return pubsub.publish('socialSharefail',res);
    });
};
