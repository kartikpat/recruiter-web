$(document).ready(function(){
	var recruiterID = localStorage.recruiterID ;
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/job/"+jobID, {
		userID: userID
	}, storeProfile)

	$('#slider').click(function() {
	  $('.more_info').slideToggle();
	  
	});

	var storeProfile = function(res){
		if(res.status=="success"){
			console.log(res);
		}
	}
})
