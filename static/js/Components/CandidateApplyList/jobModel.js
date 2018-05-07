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
		settings.jobMultipleLocation = $("#jobMultipleLocation");
		settings.jobSeparator = $("#jobSeparator");
		settings.locSeperator = $("#locSeperator");
		settings.jobExperience = $("#jobExperience");
		settings.jobEditButton = $("#jobEditButton");
		settings.jobPremiumButton = $("#jobPremiumButton");
		settings.jobUnpublishButton = $("#jobUnpublishButton");
		settings.calendarContainer = $(".calendarContainer");
		settings.calendarSelect = $(".calendarSelect");
		settings.openJobRefreshButton = $("#jobRefreshButton");
		settings.jobPostFacebook = $("#jobPostFacebook");
		settings.jobPostTwitter = $("#jobPostTwitter");
		settings.jobPostLinkedin = $("#jobPostLinkedin");
		settings.defaultCalendar = null;
		settings.jobOtherActions = $("#jobOtherActions");
		settings.calendarSelectError = $(".calendarSelectError");
		settings.createCalendar = $("#createCalendar");
		settings.jobUnpublishModal = $(".unpublishModal")
		settings.jobRefreshModal = $(".refreshModal")
		settings.jobPremiumModal = $(".premiumModal");
		settings.loaderOverlay = $("#loaderOverlay");
		settings.calendarLength = null;
		settings.refreshButton= $(".refreshButton")
		settings.socialIcon = $(".socialIcon");
		settings.selectDefaultCalendar = $(".selectDefaultCalendar")
		settings.jobStatus = ''
		onClickCreateCalendar();
		onClickJobOtherActions()
		onClickJobRefresh();
		onClickJobCancel();
		onClickJobMakePremium();
		onClickJobEdit()
		onClickShareOnFB();
		onClickShareOnTwitter();
		onClickShareOnLinkedIn();
		$(window).click(function(event) {
    		settings.jobOtherActions.addClass('inactive');
    	});
	}

	function onClickShareOnFB(fn){
		settings.jobPostFacebook.click(function(e){

			e.stopPropagation()

			var eventObj = {
				event_category: eventMap["socialIconsClick"]["cat"],
				event_label: 'origin=CandidateApplyList,type=FB,recId='+recruiterId+',JobId='+jobId+''
			}
			sendEvent(eventMap["socialIconsClick"]["event"], eventObj)
			return true;
		});
	}

	function onClickShareOnTwitter(fn){
		settings.jobPostTwitter.click(function(e){
			e.stopPropagation()

			var eventObj = {
				event_category: eventMap["socialIconsClick"]["cat"],
				event_label: 'origin=CandidateApplyList,type=Twitter,recId='+recruiterId+',JobId='+jobId+''
			}
			sendEvent(eventMap["socialIconsClick"]["event"], eventObj)
			return true;
		});
	}

	function onClickShareOnLinkedIn(fn){
		settings.jobPostLinkedin.click(function(e){
			e.stopPropagation()

			var eventObj = {
				event_category: eventMap["socialIconsClick"]["cat"],
				event_label: 'origin=CandidateApplyList,type=Linkedin,recId='+recruiterId+',JobId='+jobId+''
			}
			sendEvent(eventMap["socialIconsClick"]["event"], eventObj)
			return true;
		});
	}

	function setJobDetails(data){
		settings.jobTitle.text(data["jobTitle"]).removeClass("shell");
		settings.jobId.text("Job Code: " +data["jobPublishedId"]).removeClass("shell");
		var locText = data["jobLocation"].join(", ")
		if(data["jobLocation"].length) {
			settings.jobSeparator.removeClass("hidden")
			var jobLocationTitle = (data["jobLocation"] && data["jobLocation"].length >3) ? data["jobLocation"].join(','): null;
			var jobLocationStr = (data["jobLocation"] && data["jobLocation"].length >3) ? "Multiple Locations" : data["jobLocation"].join(',');
			settings.jobLocation.text(jobLocationStr).removeClass("shell");
			settings.jobLocation.attr("title",jobLocationTitle).addClass("tooltip");
		
		}
		$(".tooltip").tooltipster({
		   animation: 'fade',
		   delay: 0,
		   side:['bottom'],
		   theme: 'tooltipster-borderless',
		   maxWidth: 500
	   })

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
		settings.status = data["jobStatus"];
		var statusArr = ["published", "unpublished", "updated-published", "updated-unpublished"];
		if(statusArr.indexOf(status) != -1) {
			populateCalendarOptions(data["calendars"])
		}
		settings.refreshButton.attr("data-refresh-job-id", data["jobId"]);
		if(status == "published" || status == "updated-published") {
            settings.jobUnpublishButton.removeClass("hidden")

            if(data["isRefreshable"]) {
				 settings.openJobRefreshButton.removeClass("hidden")
			}
            if(!data["isPremium"])
                settings.jobPremiumButton.removeClass("hidden")
			if(data["jobSocialShareUrl"]) {
				// debugger
				var url = config["baseUrlJob"] + data["jobSocialShareUrl"];
				settings.jobPostFacebook.attr("href", getFacebookShareLink(url)).removeClass("hidden")
				settings.jobPostTwitter.attr("href", getTwitterShareLink(url)).removeClass("hidden")
				settings.jobPostLinkedin.attr("href", getLinkedInShareUrl(url)).removeClass("hidden")
			}
        }

		if(data["cnfi"]) {
			settings.socialIcon.addClass("hidden")
		}
		if(settings.jobOtherActions.find(".action-list-items li a.hidden").length < 4) {
			settings.jobOtherActions.removeClass("hidden")
		}

        if(data["isEditable"]) {
            settings.jobEditButton.attr("href","/job/"+data["jobId"]+"/edit").removeClass("hidden")
		}
		
	}

	function onClickJobEdit() {
		settings.jobEditButton.click(function(e) {
			var eventObj = {
				event_category: eventMap["editJobClick"]["cat"],
				event_label: 'origin=CandidateApplyList,JobStatus='+settings.status+',recId='+recruiterId+''
			}
			sendEvent(eventMap["editJobClick"]["event"], eventObj)
			return true
		})
	}

	function onClickCreateCalendar() {
		settings.createCalendar.click(function(e){
			window.location = "/interview-scheduler-updated"
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
				settings.jobPremiumModal.find(".button-wrapper").removeClass("hidden")
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
		settings.jobPremiumModal.find(".jobMakePremiumButton").click(function(e){
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
		item.element.attr({
			disabled: "disabled",
			selected: "selected"
		});
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

	function getSelectedCalendarId() {
		return settings.calendarSelect.val()
	}

	function setSelectedCalendarId(calendarId) {
		settings.calendarSelect.val(calendarId)
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
			settings.calendarSelectError.addClass("hidden")
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

	function showSpinner(type) {
		if(type == "refresh") {
			settings.refreshButton.addClass('hidden')
			settings.jobRefreshModal.find(".spinner").removeClass("hidden")
			return
		}
		if(type == "unpublish") {
			settings.jobUnpublishModal.find(".jobUnpublishButton").addClass('hidden')
			settings.jobUnpublishModal.find(".spinner").removeClass("hidden")
			return
		}
		settings.jobPremiumModal.find(".jobMakePremiumButton").addClass('hidden')
		settings.jobPremiumModal.find(".spinner").removeClass('hidden')
	}

	function hideSpinner(type){
		if(type == "refresh") {
			settings.refreshButton.removeClass('hidden')
			settings.jobRefreshModal.find(".spinner").addClass("hidden")
			return
		}
		if(type == "unpublish") {
			settings.jobUnpublishModal.find(".jobUnpublishButton").removeClass('hidden')
			settings.jobUnpublishModal.find(".spinner").addClass("hidden")
			return
		}
		settings.jobPremiumModal.find(".jobMakePremiumButton").removeClass('hidden')
		settings.jobPremiumModal.find(".spinner").addClass('hidden')
	}

	function openSelectDefaultCalendarModal() {
		addBodyFixed()
		settings.selectDefaultCalendar.removeClass("hidden")
	}

	function closeCalendarModal() {
		settings.selectDefaultCalendar.addClass("hidden")
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
		showSpinner: showSpinner,
		hideSpinner: hideSpinner,
		getCalendarLength: getCalendarLength,
		getSelectedCalendarId: getSelectedCalendarId,
		setDefaultCalendar: setDefaultCalendar,
		openSelectDefaultCalendarModal: openSelectDefaultCalendarModal,
		closeCalendarModal: closeCalendarModal,
		setSelectedCalendarId: setSelectedCalendarId
	}
}
