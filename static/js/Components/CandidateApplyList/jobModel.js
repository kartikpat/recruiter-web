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
		settings.jobOtherActions = $("#jobOtherActions")
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
		var statusArr = ["published", "unpublished"];
		if(statusArr.indexOf(status) != -1) {
			populateCalendarOptions(data["calendars"])
		}
		if(status == "published" && !data["isPremium"]) {
			console.log("a")
            settings.jobUnpublishButton.removeClass("hidden")
            if(data["refresh"])
    		    settings.jobRefreshButton.removeClass("hidden")
            if(!data["premium"])
                settings.jobPremiumButton.removeClass("hidden")
        }
        if(data["editable"]) {
            settings.jobEditButton.attr("href","/post-job?jobId="+data["id"]+"").removeClass("hidden")
        }
	}

	function onClickJobCancel(fn){
		settings.jobUnpublishButton.click(function(e){
			var modal = $(".unpublishModal")
			var jobId = $(this).attr("data-id");
			modal.removeClass('hidden');
			modal.find(".unpublishButton").click(function(){
				fn(jobId)
			});
		});
	}

	function onClickJobRefresh(fn) {
		settings.jobRefreshButton.click(function(e) {
			var modal = $(".refreshModal")
			var jobId = $(this).attr("data-id");
			modal.removeClass('hidden');
			modal.find(".refreshButton").click(function(){
				fn(jobId)
			});
            return false;
		})
	}

	function onClickJobMakePremium(fn) {
		settings.jobPremiumButton.click(function(e) {
			var jobId = $(this).attr("data-id");
			var modal = $(".premiumModal");
			if(config["availableCredits"] > 0) {
				modal.find('.premiumButton').click(function(){
					fn(jobId)
				}).removeClass("hidden");
				modal.find(".section.modal_text").text("This job will be highlighted and moved to top of the list for 15 days starting today. You will have "+(parseInt(config["availableCredits"]) - 1)+" credits left.")
				modal.removeClass('hidden');
				return false
			}
			modal.find(".js_modalText").text("Reach out to more candidates in less amount of time by making your job premium.")
			modal.find(".section.modal_text").text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
            modal.removeClass('hidden');
			//shootEmail()
		})
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

	//
    // }

	function onClickJobOtherActions() {
        settings.jobOtherActions.click(function(event) {
            $(this).toggleClass("inactive");
        })
    }

	return {
		init: init,
        setJobDetails: setJobDetails,
		onClickJobOtherActions: onClickJobOtherActions,
		onClickJobCancel: onClickJobCancel,
		onClickJobRefresh: onClickJobRefresh,
		onClickJobMakePremium: onClickJobMakePremium,
	}

}


 // function setJobDetails(data) {
 //        var item = getJobElements();
 //        item.title.text().removeClass("hidden");
 //
 //    }
