function getSocialAccess(recruiterId,platform){
    debugger
    return getRequest("/recruiter/"+recruiterId+"/social?platform"+platform, {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("",res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("", res);
	});
}
