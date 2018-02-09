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
		settings.defaultCalendar = null;
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
			console.log("a")
			populateCalendarOptions(data["calendars"])
            // item.unpublish.removeClass("hidden")
            // if(data["refresh"])
    		//     item.refresh.removeClass("hidden")
            // if(!data["premium"] )
            //     item.premium.removeClass("hidden")
        }

	}

	function getCalendarElement() {
		var card = $(".calendarOptions.prototype").clone().removeClass("prototype hidden");
		return {
			element : card
		}
	}

	function populateCalendarOptions(array) {
        if(array.length < 1)
            return
        else if(array.length == 1) {
            list.rowContainer.find(".jsSendInterviewInvite").attr("data-calendar-id",array[0]["id"])
            return
        }
		var calendarOptionsStr = '';
		var item = getCalendarElement()
		item.element.text("Calendar Link: Select");
		item.element.attr("value","");
		calendarOptionsStr += item.element[0].outerHTML;
        array.forEach(function(anObj){
			var item = getCalendarElement()
            item.element.text(anObj["name"]);
            item.element.attr("value",anObj["id"]);
            if(anObj["isDefault"]) {
                item.element.attr("selected", "selected");
            }
			calendarOptionsStr += item.element[0].outerHTML;
        })
		console.log(calendarOptionsStr)
		settings.calendarContainer.find(".calendarSelect").html(calendarOptionsStr)
		settings.calendarContainer.removeClass("hidden")
    }

    function setDefaultCalendar(calendarId){
    	if(!calendarId)
    		return alert('Select a default calendar');
    	settings.defaultCalendar = calendarId

    }

    function getDefaultCalendar(){
    	return settings.defaultCalendar;
    }

	// function showActions(data) {
    //     console.log(data)
	//
    //     else if(data["status"] == "unpublished") {
    //         item.calendar.removeClass("hidden")
    //     }
    //     if(data["editable"]) {
    //         item.edit.attr("href","/post-job?jobId="+data["id"]+"").removeClass("hidden")
    //     }
	//
    // }

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
