function Job(){
	var settings = {};
	function init(){
		settings.jobId = $("#jobCode");
		settings.jobTitle = $("#jobTitle");
		settings.jobLocation = $("#jobLocation");
		settings.jobSeparator = $("#jobSeparator");
		settings.jobExperience = $("#jobExperience");
		settings.jobEditButton = $("#jobEditButton");
		settings.jobPremiumButton = $("#jobPremiumButton");
		settings.jobUnpublishButton = $("#jobUnpublishButton");
		settings.calendarContainer = $("#calendarContainer");
		settings.jobRefreshButton = $("#jobRefreshButton");
		settings.jobPostFacebook = $("#jobPostFacebook");
		settings.jobPostTwitter = $("#jobPostTwitter");
		settings.jobPostLinkedin = $("#jobPostLinkedin");
	}

	function setJobDetails(data){
		
	}

}

	
 // function setJobDetails(data) {
 //        var item = getJobElements();
 //        item.title.text(unescape(data["title"])).removeClass("hidden");
 //        if(data["location"]) {
 //            item.location.text(data["location"]).removeClass("hidden")
 //            item.seperator.removeClass("hidden")

 //        }
 //        if(data["experience"]) {
 //            item.experience.text(unescape(data["experience"])).removeClass("hidden")
 //        }
 //    }