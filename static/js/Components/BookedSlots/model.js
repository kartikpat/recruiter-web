
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
		settings.bookedSlotsview=$('.bookedSlots'),
		settings.header=$('.action-wrapper'),
		settings.headerSlot=$('.header-slot')
		settings.noInterviewView=$('.empty-view'),
		settings.tableRowShell = $(".tableRow.shell");
		settings.loaderOverlay = $("#loaderOverlay");
		settings.date = ""
		onClickInterviewCancel();
        onClickToggle()
		jQuery(".header .menu-list-item.my-interviews").addClass("active");
		// settings.noInterviewView.removeClass('hidden');

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
			jobExp: card.find('.jobExp'),
			jobLocation: card.find('jobLocation'),
			jobMultipleLocation: card.find('jobMultipleLocation')
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
        if(aData["slot"]){
            var date = moment(aData["slot"]["date"]).format('ll');

			var width=$(window).width();

			if(width>800) {
				if(settings.date != date) {
					settings.date = date;
					item.interviewDate.text(date)
					if(index > 0)
						item.element.addClass("border-top")
				}
			}
			else {
				settings.date = date;
                item.interviewDate.text(date)
			}

			var time = aData["slot"]["time"];
			var temp = time.substr(0,2) + ":" + time.substr(2,2);
			var temp1 =	moment(temp, 'HH:mm').add(30, 'minutes').format('HH:mm');
			var showTime = temp + " to " + temp1;
    		item.interviewTime.text(showTime)
        }
		item.calendarName.text(aData["calendar"]["name"]);
		item.calendarName.attr("href","/calendar/"+aData["calendar"]["id"]+"/edit");
		item.candName.text(aData["name"])
		item.candName.attr("href", "/job/"+aData["job"]["id"]+"/applications/27989797");
        item.candDesignation.text(aData["designation"])

        if(aData["exp"]) {
            var experience = aData["exp"]['year']+'y '+aData['exp']['month'] +'m'
            item.candExperience.text(experience)
        }
		item.jobName.text(title)
		item.jobName.attr("href", "/job/"+aData["job"]["id"]+"/applications")

		// var locText = aData["job"]["location"].join(", ")
		// if(aData["job"]["location"].length) {
		// 	if(aData["job"]["location"].length <= 1){
		// 		item.jobLocation.text(locText)
		// 	}
		// 	else{
		// 		item.jobLocation.addClass("hidden")
		// 		item.jobMultipleLocation.attr("title",locText).removeClass("hidden");
		// 	}
		// }
		// else {
		// 	item.jobLocation.addClass("hidden")
		// }
		//
		// item.jobExp.text(aData["job"]["exp"]['min']+ ' - ' + aData["job"]['exp']['max'] +' yrs')
		return item;
	}

	function addToList(dataArray,pageNumber,pageContent){
		var str = '';
		settings.noInterviewView.addClass('hidden');
		settings.bookedSlotsview.removeClass('hidden');
		settings.header.removeClass('hidden');
		if(dataArray.length<1 && pageNumber ==1) {
			settings.noInterviewView.removeClass('hidden');
			settings.bookedSlotsview.addClass('hidden');
			settings.header.addClass('hidden');
		}
		dataArray.forEach(function(aData, index){
			var item = createElement(aData ,index);
			str+=item.element[0].outerHTML;
		});
		settings.bookedSlots.append(str);
		initializeTooltip()
		if(dataArray.length< pageContent) {
			return settings.bookedSlots.append("<div class='no-data'>No more records!</div>")
			hideLoaderOverlay();
		}


	}

	function emptySlots(){
		settings.bookedSlots.empty()
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


	function startdate(fn){
        $("#startdatepicker").datepicker({
			showOn: "button",
            buttonImage: '/static/images/smallcalendar.svg',
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd-mm-yy',
            fielddateFormat: 'dd-mm-yy',
            altField:   '#start_date',
            altFormat: "yy-mm-dd",
            showOn: 'both',
            onSelect: function(){
				fn();
			}

        });
    }

	function getStartDate(){
        var fromDate=$('#start_date').datepicker().val();
        fromDate=fromDate+':00:00:00'
        console.log(fromDate);
        return fromDate;
    }

	function initializeTooltip() {
		 $(".tooltip").not(".prototype .tooltip").tooltipster({
			animation: 'fade',
			delay: 0,
			side:['bottom'],
			theme: 'tooltipster-borderless',
			maxWidth: 500
		})
	}


	return {
		init: init,
		addToList: addToList,
		onClickSubmitCancelInterview: onClickSubmitCancelInterview,
		setConfig : setConfig,
		onChangeCalendarFilters: onChangeCalendarFilters,
		closeModal: closeModal,
		startdate:startdate,
		getStartDate:getStartDate,
		openModal: openModal,
		emptySlots:emptySlots,
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
