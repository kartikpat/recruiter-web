function Job(){
	var settings = {};
	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}

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
		settings.calendarSelect = $("#calendarSelect");
		settings.jobRefreshButton = $("#jobRefreshButton");
		settings.jobPostFacebook = $("#jobPostFacebook");
		settings.jobPostTwitter = $("#jobPostTwitter");
		settings.jobPostLinkedin = $("#jobPostLinkedin");
		settings.defaultCalendar = null;
		settings.jobOtherActions = $("#jobOtherActions");
		settings.calendarSelectError = $("#calendarSelectError");
		settings.createCalendar = $("#createCalendar");
		settings.jobUnpublishModal = $(".unpublishModal")
		settings.jobRefreshModal = $(".refreshModal")
		settings.jobPremiumModal = $(".premiumModal");
		onClickCreateCalendar();
		onClickJobOtherActions()
		onClickJobRefresh();
		onClickJobCancel();
		onClickJobMakePremium();
	}

	function setJobDetails(data){
		console.log(data)
		settings.jobTitle.text(data["jobTitle"]).removeClass("hidden");
		settings.jobId.text(data["jobPublishedId"]).removeClass("hidden");
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
		if(status == "published") {
            settings.jobUnpublishButton.removeClass("hidden")
			settings.jobOtherActions.removeClass("hidden")

            if(data["isRefreshable"])
    		    settings.jobRefreshButton.removeClass("hidden")
            if(!data["isPremium"])
                settings.jobPremiumButton.removeClass("hidden")
			if(data["jobSocialShareUrl"]) {
				var url = config["baseUrlJob"] + data["jobSocialShareUrl"];
				settings.jobPostFacebook.attr("href", getFacebookShareLink(url))
				settings.jobPostTwitter.attr("href", getTwitterShareLink(url))
				settings.jobPostLinkedin.attr("href", getLinkedInShareUrl(url))
			}
        }

        if(data["isEditable"]) {
            settings.jobEditButton.attr("href","/job/"+data["jobId"]+"/edit").removeClass("hidden")
        }
	}

	function onClickCreateCalendar() {
		settings.createCalendar.click(function(e){
			alert("clicked")
		})
	}

	function onClickJobCancel(fn){
		settings.jobUnpublishButton.click(function(e){
			settings.jobUnpublishModal.find("input:radio[name='unpublishReason']:checked").prop('checked', false);
			addBodyFixed()
			settings.jobUnpublishModal.removeClass('hidden');
		});
	}

	function onClickSubmitUnpublishJob(fn){
		settings.jobUnpublishModal.find(".jobUnpublishButton").click(function(e){
			var reason = settings.jobUnpublishModal.find("input:radio[name='unpublishReason']:checked").attr('id');
			if(!reason){
				settings.jobUnpublishModal.find('.error').removeClass('hidden');
				return
			}
			return fn(reason);
		});
	}

	function onClickJobRefresh(fn) {
		settings.jobRefreshButton.click(function(e) {
			addBodyFixed()
			settings.jobRefreshModal.removeClass('hidden');
		})
	}

	function onClickSubmitRefreshJob(fn){
		settings.jobRefreshButton.click(function(){
			var jobId = $(this).attr('data-refresh-job-id');
			return fn(jobId);
		});
	}

	function onClickJobMakePremium(fn) {
		settings.jobPremiumButton.click(function(e) {
			if(config["availableCredits"] > 0) {
				settings.jobPremiumModal.find(".premiumButton").removeClass("hidden");
				settings.jobPremiumModal.find(".section.modal_text").text("This job will be highlighted and moved to top of the list for 15 days starting today. You will have "+(parseInt(config["availableCredits"]) - 1)+" credits left.")
				addBodyFixed()
				settings.jobPremiumModal.removeClass('hidden');
				return false
			}
			settings.jobPremiumModal.find(".js_modalText").text("Reach out to more candidates in less amount of time by making your job premium.")
			settings.jobPremiumModal.find(".section.modal_text").text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
			addBodyFixed()
            settings.jobPremiumModal.removeClass('hidden');
			//shootEmail()
		})
	}

	function onClickSubmitPremiumJob(fn){
		settings.jobPremiumModal.find(".premiumButton").click(function(e){
			return fn();
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
        	settings.createCalendar.removeClass("hidden");
		// if(array.length == 1)
		// 	setDefaultCalendar(array[0]["id"]);
		var calendarOptionsStr = '';
		var item = getCalendarElement();
		item.element.text("Calendar Link: Select");
		item.element.attr("value","");
		calendarOptionsStr += item.element[0].outerHTML;
        array.forEach(function(anObj){
			var item = getCalendarElement()
            item.element.text(anObj["name"]);
            item.element.attr("value",anObj["id"]);
            if(anObj["isDefault"]) {
				setDefaultCalendar(anObj["defaultID"])
                item.element.attr("selected", "selected");
            }
			calendarOptionsStr += item.element[0].outerHTML;
        })
		settings.calendarSelect.html(calendarOptionsStr)
		settings.calendarContainer.removeClass("hidden")
    }

    function setDefaultCalendar(calendarId){
    	if(!calendarId)
    		showCalendarMissingError()
    	settings.defaultCalendar = calendarId
    }

    function getDefaultCalendar(){
    	return settings.defaultCalendar;
    }

	function onClickJobOtherActions() {
        settings.jobOtherActions.click(function(event) {
            $(this).toggleClass("inactive");
        })
    }

	function onChangeDefaultCalendar(fn) {
		settings.calendarSelect.on('change', function(e) {
			console.log("a")
			var calendarId = $(this).val();
			return fn(calendarId)
		})
	}

	function showCalendarMissingError() {
		settings.calendarSelectError.text("Please Select the calendar!").removeClass("hidden");
	}

	function closeModal() {
		removeBodyFixed()
		$(".modal").addClass("hidden")
	}

	return {
		init: init,
		setConfig: setConfig,
        setJobDetails: setJobDetails,
		onClickSubmitUnpublishJob: onClickSubmitUnpublishJob,
		onClickSubmitRefreshJob: onClickSubmitRefreshJob,
		getDefaultCalendar: getDefaultCalendar,
		showCalendarMissingError: showCalendarMissingError,
		onChangeDefaultCalendar: onChangeDefaultCalendar,
		onClickSubmitPremiumJob: onClickSubmitPremiumJob,
		closeModal: closeModal
	}

}
