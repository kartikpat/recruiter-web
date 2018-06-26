function getSocialAccess(recruiterId,platform){
    return getRequest("/recruiter/"+recruiterId+"/social",{platform:platform},function(res){
		if(res.status && res.status =='success'){
			console.log(res)
			debugger
			return pubsub.publish("tokenSuccess",res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("tokenfailure", res);
	});
}
