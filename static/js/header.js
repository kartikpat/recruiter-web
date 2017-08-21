var recruiterID = localStorage.id;
var baseUrl = "http://13.126.92.102:8000"

$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateHeader);

})

var populateHeader = function(res) {
    if(res.status =="success") {
        $('.user_profile_side .email').text(res["data"][0]["email"])
    }
}
