var recruiterID = localStorage.id;

$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateHeader);

})

var populateHeader = function(res) {
    if(res.status =="success") {
        $('.user_profile_side .email').text(res["data"][0]["email"])
    }
}
