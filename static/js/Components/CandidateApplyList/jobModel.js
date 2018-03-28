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
		settings.locSeperator = $("#locSeperator");
		settings.jobExperience = $("#jobExperience");
		settings.jobEditButton = $("#jobEditButton");
		settings.jobPremiumButton = $("#jobPremiumButton");
		settings.jobUnpublishButton = $("#jobUnpublishButton");
		settings.calendarContainer = $("#calendarContainer");
		settings.calendarSelect = $("#calendarSelect");
		settings.openJobRefreshButton = $("#jobRefreshButton");
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
		settings.loaderOverlay = $("#loaderOverlay");
		settings.calendarLength = null;
		settings.refreshButton= $(".refreshButton")

		onClickCreateCalendar();
		onClickJobOtherActions()
		onClickJobRefresh();
		onClickJobCancel();
		onClickJobMakePremium();
		$(window).click(function(event) {
    		settings.jobOtherActions.addClass('inactive');
    	});
	}

	function setJobDetails(data){
		console.log(data)
		settings.jobTitle.text(data["jobTitle"]).removeClass("shell");
		settings.jobId.text("Job Code: " +data["jobPublishedId"]).removeClass("shell");
		if(data["jobLocation"]) {
	        settings.jobLocation.text(data["location"]).removeClass("shell")
	        settings.jobSeparator.removeClass("hidden")
	    }
		else {
			settings.jobLocation.addClass("hidden")
		}
        if(data["jobExperience"]) {
            settings.jobExperience.text(data["jobExperience"]).removeClass("shell")
        }
		else {
			settings.jobExperience.addClass("hidden")
		}
		if(data["jobLocation"] && data["jobExperience"]) {
			settings.locSeperator.removeClass("hidden")
		}
		var status = data["jobStatus"];
		var statusArr = ["published", "unpublished"];
		if(statusArr.indexOf(status) != -1) {
			populateCalendarOptions(data["calendars"])
		}
		settings.refreshButton.attr("data-refresh-job-id", data["jobId"]);
		if(status == "published") {
            settings.jobUnpublishButton.removeClass("hidden")
			settings.jobOtherActions.removeClass("hidden")

            if(data["isRefreshable"]) {
				 settings.openJobRefreshButton.removeClass("hidden")

			}

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
			e.stopPropagation()
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

	function onClickJobRefresh() {
		settings.openJobRefreshButton.click(function(e) {
			e.stopPropagation()
			addBodyFixed()
			settings.jobRefreshModal.removeClass('hidden');
		})
	}

	function onClickSubmitRefreshJob(fn) {
		settings.refreshButton.click(function() {
			var jobId = $(this).attr('data-refresh-job-id');
			return fn(jobId);
		});
	}

	function onClickJobMakePremium(fn) {
		settings.jobPremiumButton.click(function(e) {
			e.stopPropagation()
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
        if(array.length < 1) {
			settings.calendarContainer.addClass("hidden");
			settings.createCalendar.removeClass("hidden");
			return
		}
		settings.calendarLength =  array.length
		var calendarOptionsStr = '';
		var item = getCalendarElement();
		item.element.text("Calendar Link: Select");
		item.element.attr("value","-1");
		item.element.attr("disabled","disabled");
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
			event.stopPropagation()
            $(this).toggleClass("inactive");
        })
    }

	function getCalendarLength() {
		return settings.calendarLength;
	}

	function onChangeDefaultCalendar(fn) {
		settings.calendarSelect.on('change', function(e) {

			var calendarId = $(this).val();
			if(parseInt(calendarId) == -1) {
				return
			}
			return fn(calendarId)
		})
	}

	function showCalendarMissingError() {
		settings.calendarSelectError.text("Choose a calendar to send to the applicants for this job!").removeClass("hidden");
		$('html, body').animate({
			scrollTop: ($("#calendarSelectError").closest('.calendar-options').offset().top - 20)
		},200);
	}

	function closeModal() {
		removeBodyFixed()
		$(".modal").addClass("hidden")
	}

	function showLoaderOverlay() {
		settings.loaderOverlay.removeClass("hidden")
	}

	function hideLoaderOverlay() {
		settings.loaderOverlay.addClass("hidden")
	}

	function openModal(type) {
		if(type == "refresh") {
			addBodyFixed()
			settings.jobRefreshModal.removeClass("hidden")
			return
		}
		if(type == "unpublish") {
			addBodyFixed()
			settings.jobUnpublishModal.removeClass("hidden")
			return
		}
		addBodyFixed()
		settings.jobPremiumModal.removeClass("hidden")
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
		closeModal: closeModal,
		openModal: openModal,
		showLoaderOverlay: showLoaderOverlay,
		hideLoaderOverlay: hideLoaderOverlay,
		getCalendarLength: getCalendarLength
	}
}
