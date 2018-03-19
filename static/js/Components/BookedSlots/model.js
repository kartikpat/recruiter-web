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
		settings.bookedSlotsview=$('.page-content'),
		settings.noInterviewView=$('.page-wrap'),
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
			jobName: card.find('.jobName'),
			jobExp: card.find('.jobExp')
		}
	}

	function getDateFormat(created) {
		return (moment(created).format('YYYY') == moment().format('YYYY')) ? moment(created).format('MMM DD') : moment(created).format('ll');
	}

	function getTitleFormat(title, regex) {
		return title.replace(regex, '');
	}

	function createElement(aData, index) {
		var item = cloneElement();
		var title = getTitleFormat(aData["job"]["title"], (/\(\d+-\d+ \w+\)$/));
        if(aData["slot"]) {
            var date = moment(aData["slot"]["date"]).format('ll');
            console.log(settings.date )
            console.log(date)
            if(settings.date != date) {
                settings.date = date;
                item.interviewDate.text(date)
				if(index > 0)
                	item.element.addClass("border-top")
            }
			var time = aData["slot"]["time"];
			var temp = time.substr(0,2) + ":" + time.substr(2,2);
			var temp1 =	moment(temp, 'HH:mm').add(30, 'minutes').format('HH:mm');
			var showTime = temp + " to " + temp1;
    		item.interviewTime.text(showTime)
        }

		item.calendarName.text(aData["calendar"]["name"]);
		// item.calendarName.attr("href",aData["calendar"]["name"]);
		item.candName.text(aData["name"])
		item.candName.attr("href", "/job/"+aData["job"]["id"]+"/applications/27989797");
        item.candDesignation.text(aData["designation"])

        if(aData["exp"]) {
            var experience = aData["exp"]['year']+'y '+aData['exp']['month'] +'m'
            item.candExperience.text(experience)
        }
		item.jobName.text(title)
		item.jobName.attr("href", "/job/"+aData["job"]["id"]+"/applications")
        item.candLocation.text(aData["location"])
		// item.jobExp.text(aData[""])
		return item;
	}

	function addToList(dataArray){
		var str = '';
		hideShell();
		dataArray.length=0;
		if(!dataArray.length) {
		//	debugger
			settings.bookedSlotsview.addClass('hidden');
			settings.noInterviewView.removeClass('hidden');		
		}
		dataArray.forEach(function(aData, index){
			var item = createElement(aData , index);
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
