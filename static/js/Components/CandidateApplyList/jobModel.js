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
		console.log(data)
		settings.jobTitle.text(data["jobTitle"]).removeClass("hidden");
		settings.jobId.text(data["jobId"]).removeClass("hidden");
		if(data["jobLocation"]) {
	        settings.jobLocation.text(data["location"]).removeClass("hidden")
	        settings.jobSeparator.removeClass("hidden")
	    }
        if(data["jobExperience"]) {
            settings.jobExperience.text(data["experience"]).removeClass("hidden")
        }
		var status = data["jobStatus"];
		if(status == "published" && !data["isPremium"]) {
            item.calendar.removeClass("hidden")
            item.unpublish.removeClass("hidden")
            if(data["refresh"])
    		    item.refresh.removeClass("hidden")
            if(!data["premium"] )
                item.premium.removeClass("hidden")
        }

	}

	function showActions(data) {
        console.log(data)

        else if(data["status"] == "unpublished") {
            item.calendar.removeClass("hidden")
        }
        if(data["editable"]) {
            item.edit.attr("href","/post-job?jobId="+data["id"]+"").removeClass("hidden")
        }

    }

	return {
		init: init,
        setJobDetails: setJobDetails
	}

}


 // function setJobDetails(data) {
 //        var item = getJobElements();
 //        item.title.text().removeClass("hidden");
 //
 //    }
