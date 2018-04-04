var test = null;

function Jobs() {

	var settings = {};
	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}

	function init() {
		settings.rowContainer= $('#jobRowList'),
		settings.jobFilters= $('#jobFilters'),
		settings.jobEditButton= '.jobEdit',
		settings.jobHeading=$('.heading'),
		settings.openJobUnpublishModalButton= '.unpublishModalButton',
		settings.openJobRefreshModalButton= '.refreshModalButton',
		settings.openMakeJobPremiumModalButton= '.makePremiumModalButton',
		settings.jobUnpublishModal= $('.unpublishModal'),
		settings.jobUnpublishButton= $('.jobUnpublishButton'),
		settings.jobRefreshModal= $(".refreshModal"),
		settings.jobRefreshButton= $(".jobRefreshButton"),
		settings.jobMakePremiumModal= $(".premiumModal"),
		settings.jobMakePremiumButton= $(".jobMakePremiumButton")
		settings.tooltip= $(".tooltip");
		settings.tableRowShell = $(".tableRow.shell");
		settings.loaderOverlay = $("#loaderOverlay");
		settings.emptyView=$('.empty-screen');
		settings.headings=$('.table-headings');
		settings.socialIcon = $('.socialIcon');
		$(".header .menu-list-item.my-jobs").addClass("active");

		onClickJobRefresh();
		onClickJobCancel();
		onClickJobMakePremium();

	}

	function onClickJobCancel(fn){
		settings.rowContainer.on('click',settings.openJobUnpublishModalButton,function(e){
			e.preventDefault();
			e.stopPropagation()
			var jobId = $(this).attr("data-job-id");
			settings.jobUnpublishModal.find("input:radio[name='unpublishReason']:checked").prop('checked', false);
			addBodyFixed()
			settings.jobUnpublishModal.removeClass('hidden');
			settings.jobUnpublishButton.attr('data-unpublish-job-id', jobId);
		});
	}

	function onClickSubmitUnpublishJob(fn){
		settings.jobUnpublishButton.click(function(e){
			var jobId= $(this).attr('data-unpublish-job-id');
			var reason = settings.jobUnpublishModal.find("input:radio[name='unpublishReason']:checked").attr('id');
			if(!reason){
				settings.jobUnpublishModal.find('.error').removeClass('hidden');
				return
			}
			return fn(jobId,reason);
		});
	}

	function onClickJobEdit() {
		settings.rowContainer.on('click', settings.jobEditButton ,function(e) {
			return parseInt($(this).attr('data-job-isEditable')) ? true : false;
		})
	}

	function onClickJobRefresh(fn) {
		settings.rowContainer.on('click', settings.openJobRefreshModalButton,function(e) {
			e.preventDefault();
			e.stopPropagation()
			if(parseInt($(this).attr("data-job-refreshable"))) {
				var jobId = $(this).attr("data-job-id");
				addBodyFixed()
				settings.jobRefreshModal.removeClass('hidden');
				settings.jobRefreshButton.attr('data-refresh-job-id', jobId);
			}
			// return false;
		})
	}

	function onClickSubmitRefreshJob(fn){
		settings.jobRefreshButton.click(function(){
			var jobId = $(this).attr('data-refresh-job-id');
			return fn(jobId);
		});
	}

	function onClickJobMakePremium(fn) {
		settings.rowContainer.on('click', settings.openMakeJobPremiumModalButton,function(e) {
			e.stopPropagation()
			if(parseInt($(this).attr("data-job-isPremium"))) {
				return false;
			}
			var jobId = $(this).attr("data-job-id");
			settings.jobMakePremiumButton.attr('data-premium-job-id', "");
			if(config["availableCredits"] > 0) {
				settings.jobMakePremiumButton.attr('data-premium-job-id', jobId);
				settings.jobMakePremiumButton.removeClass("hidden")
				settings.jobMakePremiumModal.find(".modalTextSecondary").text("This job will be highlighted and moved to top of the list for 15 days starting today. You will have "+(parseInt(config["availableCredits"]) - 1)+" credits left.")
				addBodyFixed()
				settings.jobMakePremiumModal.removeClass('hidden');
				return false
			}
			settings.jobMakePremiumModal.find(".modalTextPrimary").text("Reach out to more candidates in less amount of time by making your job premium.")
			settings.jobMakePremiumModal.find(".modalTextSecondary").text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
			addBodyFixed()
			settings.jobMakePremiumModal.removeClass('hidden');
			//shootEmail()
			return false;
		})
	}
	function onClickSubmitPremiumJob(fn){
		settings.jobMakePremiumButton.click(function(e){
			e.preventDefault();
			var jobId = $(this).attr('data-premium-job-id');
			if(!jobId)
				return
			return fn(jobId);
		})
	}

	function onChangeJobFilters(fn) {
		settings.jobFilters.change(function() {
			var sortById = $(this).val();
		    return fn(sortById);
		})
	}

	function cloneElement(id) {
		var card = $('.table-row.job.prototype').clone().removeClass('prototype hidden')
		card.attr('data-job-id', id);
		return {
			element: card,
			createdOn: card.find('.createdOn'),
			title: card.find('.jobTitle'),
			location: card.find('.jobLocation'),
			multipleLocation: card.find('.jobMultipleLocation'),
			metaSeperator: card.find('.jobMetaSeperator'),
			experience: card.find('.jobExperience'),
			status: card.find('.jobStatus'),
			statusMsg: card.find('.jobStatusMsg'),
			views: card.find('.jobViews'),
			applications: card.find('.jobApplications'),
			edit: card.find(settings.jobEditButton),
			cancel: card.find(settings.openJobUnpublishModalButton),
			refresh: card.find(settings.openJobRefreshModalButton),
			premium: card.find(settings.openMakeJobPremiumModalButton),
			facebook: card.find('.jobFacebook'),
			twitter: card.find('.jobTwitter'),
			linkedIn: card.find('.jobLinkedin'),
			socialIcons : card.find('.socialIcon')
		}
	}

	function getDateFormat(created) {
		return (moment(created).format('YYYY') == moment().format('YYYY')) ? moment(created).format('MMM DD') : moment(created).format('ll');
	}

	function getTitleFormat(title, regex) {
		return title.replace(regex, '');
	}

	function setJobStatus(aData) {
		var obj = {
			"status": aData["status"],
			"message" : "Nothing to show",
			"statusMsg": true,
			"actions": false
		}

		switch(aData["status"]) {
			case "rejected":
				if(aData["message"]){
					obj["message"] = aData["message"];
				}
				break;
			case "pending":
				obj["status"] = 'Under Review'
				obj["message"] = 'We are reviewing this job. This usually takes upto 24 hours.'
				break;
			case "published":
				obj["statusMsg"] = false;
				obj["actions"] = true;
				break;
			case "updated-published":
				obj["statusMsg"] = false;
				obj["status"] = 'Published </br>(But updated)'
			case "unpublished":
				if(aData["message"]){
					obj["message"] = aData["message"];
				}
			default:
				break;
		}
		return obj;
	}

	function createElement(aData) {
		var item = cloneElement(aData["id"]);
		var title = getTitleFormat(aData["title"], (/\(\d+-\d+ \w+\)$/));
		item.createdOn.text(getDateFormat(aData["created"]))
		item.title.text(title)
		item.element.find('.action-icon').attr('data-job-id',aData["id"]);

		var loc = aData["location"];
		var locShow = loc.toString();
		if(loc.length) {
			item.metaSeperator.removeClass("hidden");
			if(loc.length <= 3){
				item.location.append("<span>"+locShow+"</span>")
			}
			else{
				item.location.addClass("hidden")
				item.multipleLocation.attr("title",locShow).removeClass("hidden");
			}
		}
		else {
			item.location.addClass("hidden")
		}

		var experience = aData["exp"]['min']+' - '+aData['exp']['max'] +' yrs'
		item.experience.text(experience);

		var obj = setJobStatus(aData)
		item.status.append(obj["status"]);
		if(obj["statusMsg"]) {
			item.statusMsg.attr({
				"data-attribute": aData["timestamp"],
				"title": obj["message"]
			}).removeClass("hidden")
		}

		if(aData["conf"]) {
			item.socialIcons.addClass("hidden")
		}

		if(obj["actions"]) {
			item.element.find(".jobActions").removeClass("hidden");
		}

		if(aData['views']){
			item.views.text(aData['views']+' Views').removeClass("hidden");
			if(aData['totalApplications'])
				item.applications.html('<a class="link-color" href="job/'+aData["publishedId"]+'/applications">'+aData["totalApplications"]+' Applied</a>').removeClass("hidden");
			item.element.find(".engagementDefault").addClass("hidden");
		}

		item.refresh.attr("data-job-refreshable", aData["refreshable"])
		if(!aData["refreshable"])
			item.refresh.attr("title", "You can refresh this job after 7 days")

		item.edit.attr("data-job-isEditable", aData["editable"])
		item.edit.attr("href","/job/"+aData["id"]+"/edit")
		if(!aData["editable"]) {
			item.edit.attr("title","This job cannot be edited now. Reach us at hello@iimjobs.com in case of any issue.");
		}

		item.premium.attr("data-job-isPremium", aData["premium"]);
		if(aData["premium"]) {
			item.premium.find('.icon-star').addClass('hidden');
			item.premium.find('.icon-star-2').removeClass("hidden");

		}

		if(aData["url"]) {
			var url = config["baseUrlJob"] + aData["url"];
			item.facebook.attr("href", getFacebookShareLink(url))
			item.twitter.attr("href", getTwitterShareLink(url))
			item.linkedIn.attr("href", getLinkedInShareUrl(url))
		}

		return item;
	}

	function addToList(dataArray, pageNumber, pageContent,type){
		var str = '';
		hideShell()
		// type='abc'
		// dataArray.length=0;
		if(dataArray.length<1 && pageNumber ==1) {
			if(type=='all'){
				settings.emptyView.removeClass('hidden');
				settings.headings.addClass('hidden');
				settings.jobFilters.addClass('hidden');
				settings.jobHeading.removeClass('hidden');
				return
			}
			else{
				$('.user-text').text('You don’t have any jobs for the selected filters.');
				$('.empty-text').text('Please select a different filter');
			    $('.image-container img').attr('src','/static/images/filterjob.svg');
				settings.emptyView.removeClass('hidden');
				settings.headings.addClass('hidden');
				return
			}
			// return settings.rowContainer.append("<div class='no-data'>No Jobs Found!</div>")
		}

		dataArray.forEach(function(aData){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
		});

		settings.rowContainer.append(str);

		if(dataArray.length< pageContent) {
		 return settings.rowContainer.append("<div class='no-data'>No more records!</div>")
        }
		initializeTooltip()
	}

	function emptyList() {
		settings.rowContainer.empty()
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
		settings.jobMakePremiumModal.removeClass("hidden")

	}

	return {
		init: init,
		addToList: addToList,
		onClickJobEdit: onClickJobEdit,
		// onClickJobCancel: onClickJobCancel,
		// onClickJobRefresh: onClickJobRefresh,
		onClickSubmitUnpublishJob: onClickSubmitUnpublishJob,
		onClickSubmitRefreshJob: onClickSubmitRefreshJob,
		setConfig : setConfig,
		onClickJobMakePremium: onClickJobMakePremium,
		onClickSubmitPremiumJob: onClickSubmitPremiumJob,
		onChangeJobFilters: onChangeJobFilters,
		closeModal: closeModal,
		openModal: openModal,
		hideShell: hideShell,
		showShell: showShell,
		showLoaderOverlay: showLoaderOverlay,
		hideLoaderOverlay: hideLoaderOverlay,
		emptyList: emptyList
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

}
