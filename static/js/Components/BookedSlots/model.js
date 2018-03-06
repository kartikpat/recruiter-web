function BookedSlots() {

	var settings = {};
	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}

	function init() {
		settings.bookedSlots= $('.bookedSlots'),
		settings.calendarDropdown= $('#calendarDropdown'),
		settings.jobEditButton= '.jobEdit',
		settings.openCancelInterviewModalButton= '.candidateCancelInterviewInvite',
		settings.cancelInterviewModal= $('.cancelInterviewModal'),
		settings.cancelInterviewButton= $('.cancelInterviewButton'),
		settings.tableRowShell = $(".tableRow.shell");
		settings.loaderOverlay = $("#loaderOverlay");
        settings.date = ""
		onClickInterviewCancel();
        onClickToggle()

	}



	function onClickInterviewCancel(){
		settings.bookedSlots.on('click',settings.openCancelInterviewModalButton,function(e){
			e.preventDefault();
			var jobId = $(this).attr("data-job-id");
			settings.cancelInterviewModal.find("input:radio[name='unpublishReason']:checked").prop('checked', false);
			addBodyFixed()
			settings.cancelInterviewModal.removeClass('hidden');
		});
	}

	function onClickSubmitCancelInterview(fn){
		settings.cancelInterviewButton.click(function(){
			var jobId = $(this).attr('data-refresh-job-id');
			return fn(jobId);
		});
	}

	function onChangeCalendarFilters(fn) {
		settings.calendarDropdown.change(function() {
			var calendarId = $(this).val();
		    return fn(calendarId);
		})
	}

	function cloneElement(id) {
		var card = $('.slotDate.prototype').clone().removeClass('prototype hidden')
		return {
			element: card,
			interviewDate: card.find('.interviewDate'),
			interviewTime: card.find('.interviewTime'),
			calendarName: card.find('.calendarName'),
			candName: card.find('.candName'),
			candDesignation: card.find('.candDesignation'),
			candExperience: card.find('.candExperience'),
			candLocation: card.find('.candLocation'),
			jobName: card.find('.jobName')
		}
	}

	function getDateFormat(created) {
		return (moment(created).format('YYYY') == moment().format('YYYY')) ? moment(created).format('MMM DD') : moment(created).format('ll');
	}

	function getTitleFormat(title, regex) {
		return title.replace(regex, '');
	}

	function createElement(aData) {
		var item = cloneElement();
		// var title = getTitleFormat(aData["title"], (/\(\d+-\d+ \w+\)$/));
        if(aData["slot"]) {
            var date = moment(aData["slot"]["date"]).format('ll');
            console.log(settings.date )
            console.log(date)
            if(settings.date != date) {
                settings.date = date;
                item.interviewDate.text(date)
                item.element.addClass("border-top")
            }
			var time = aData["slot"]["time"];
			var showTime = time.substr(0,1) + ":" + time.substr(2,3) + " to ";
    		item.interviewTime.text(showTime)
        }

		item.candName.text(aData["name"])
        item.candDesignation.text(aData["designation"])

        if(aData["exp"]) {
            var experience = aData["exp"]['year']+'y '+aData['exp']['month'] +'m'
            item.candExperience.text(experience)
        }

        item.candLocation.text(aData["location"])



		// var obj = setJobStatus(aData)
		// item.status.append(obj["status"]);
		// if(obj["statusMsg"]) {
		// 	item.statusMsg.attr({
		// 		"data-attribute": aData["timestamp"],
		// 		"title": obj["message"]
		// 	}).removeClass("hidden")
		// }
        //
		// if(obj["actions"]) {
		// 	item.element.find(".jobActions").removeClass("hidden");
		// }
        //
		// if(aData['views']){
		// 	item.views.text(aData['views']+' Views').removeClass("hidden");
		// 	if(aData['totalApplications'])
		// 		item.applications.html('<a class="link-color" href="candidate-apply-list/'+aData["publishedId"]+'">'+aData["totalApplications"]+' Applied</a>').removeClass("hidden");
		// 	item.element.find(".engagementDefault").addClass("hidden");
		// }
        //
		// item.refresh.attr("data-job-refreshable", aData["refreshable"])
		// if(!aData["refreshable"])
		// 	item.refresh.attr("title", "You can refresh this job after 7 days")
        //
		// item.edit.attr("data-job-isEditable", aData["editable"])
		// item.edit.attr("href","/job/"+aData["id"]+"/edit")
		// if(!aData["editable"]) {
		// 	item.edit.attr("title","This job cannot be edited now. Reach us at hello@iimjobs.com in case of any issue.");
		// }
        //
		// item.premium.attr("data-job-isPremium", aData["premium"]);
		// if(aData["premium"]) {
		// 	item.premium.find('.icon-star').addClass("premium_highlight");
		// }
        //
		// if(aData["url"]) {
		// 	var url = config["baseUrlJob"] + aData["url"];
		// 	item.facebook.attr("href", getFacebookShareLink(url))
		// 	item.twitter.attr("href", getTwitterShareLink(url))
		// 	item.linkedIn.attr("href", getLinkedInShareUrl(url))
		// }

		return item;
	}

	function addToList(dataArray){
		var str = '';
		hideShell()
		if(!dataArray.length) {
			return settings.bookedSlots.html("<div class='no-data'>No Jobs Found!</div>")
		}
		dataArray.forEach(function(aData){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
		});

		settings.bookedSlots.html(str);

	}

	function closeModal() {
		removeBodyFixed()
		$(".modal").addClass("hidden")
	}

	function hideShell() {
		settings.tableRowShell.addClass("hidden")
	}

	function showShell() {
		settings.tableRowShell.removeClass("hidden")
	}

	function showLoaderOverlay() {
		settings.loaderOverlay.removeClass("hidden")
	}

	function hideLoaderOverlay() {
		settings.loaderOverlay.addClass("hidden")
	}

	function openModal(type) {
		addBodyFixed()
		settings.cancelInterview.removeClass("hidden")

	}

    function getCalendarFitersElement() {
        var card = $(".calendarOption.prototype").clone().removeClass("prototype hidden");
        return {
            element : card
        }
    }

    function populateCalendarDropdown(dataArray) {
        var str = '';
        dataArray.forEach(function(aData, index){
            var item = getCalendarFitersElement();
            item.element.text(aData["name"]);
            item.element.val(aData["id"]);
            str+=item.element[0].outerHTML;
        });
        settings.calendarDropdown.append(str);

    }

	return {
		init: init,
		addToList: addToList,
		onClickSubmitCancelInterview: onClickSubmitCancelInterview,
		setConfig : setConfig,
		onChangeCalendarFilters: onChangeCalendarFilters,
		closeModal: closeModal,
		openModal: openModal,
		hideShell: hideShell,
		showShell: showShell,
		showLoaderOverlay: showLoaderOverlay,
		hideLoaderOverlay: hideLoaderOverlay,
        populateCalendarDropdown: populateCalendarDropdown
	}

    function onClickToggle() {
        settings.bookedSlots.on('click','.button-action-list', function(){
            jQuery(this).toggleClass("inactive");
        })
    }

}
