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
		settings.type = 'all';
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
			settings.jobUnpublishModal.find('.error').addClass('hidden');
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
				settings.jobMakePremiumModal.find(".button-wrapper").removeClass("hidden")
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
			settings.type = sortById;
		    return fn(sortById);
		})
	}
	function getType(){
		settings.type = settings.jobFilters.val();
		return settings.jobFilters.val();
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
			socialIcons : card.find('.socialIcon'),
			extraStatus: card.find('.extraStatus')
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
			"actions": false,
			"extraStatus": false,
			"extraStatusMsg": 'But updated'
		}
		switch(aData["status"]) {
			case "rejected":
				obj["status"] = 'Rejected'
				if(aData["message"]){
					obj["message"] = aData["message"];
				}
				break;
			case "pending":
				obj["status"] = 'Under review'
				obj["message"] = 'We are reviewing this job. This usually takes upto 24 hours.'
				break;
			case "published":
				obj["status"] = 'Published'
				obj["statusMsg"] = false;
				obj["actions"] = true;
				if(aData["cnfi"]){
					obj["extraStatus"] = true;
					obj["extraStatusMsg"] = "(Confidential)"
				}
				break;
			case "updated-published":
				obj["statusMsg"] = false;
				obj["status"] = 'Published';
				obj["actions"] = true;
				obj["extraStatus"] = true;
				if(aData["cnfi"]) {
					obj["extraStatusMsg"] = "(Confidential)"
				}
				break;
			case "unpublished":
				obj["status"] = 'Unpublished'
				if(aData["message"]) {
					obj["message"] = aData["message"];
				}
				break;
			case "updated-unpublished":
				obj["status"] = 'Unpublished';
				obj["extraStatus"] = true;
				if(aData["message"]) {
					obj["message"] = aData["message"];
				}
				break;
			default:
				break;
		}
		return obj;
	}

	function createElement(aData) {
		console.log(aData)
		var item = cloneElement(aData["id"]);
		var title = getTitleFormat(aData["title"], (/\(\d+-\d+ \w+\)$/));
		item.createdOn.text(getDateFormat(aData["created"]))
		item.title.text(title).attr("href", "/job/"+aData["id"]+"/details")
		item.element.find('.action-icon').attr('data-job-id',aData["id"]);

		var loc = aData["location"];
		var locShow = loc.join(", ");
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

		if(obj["extraStatus"]) {
			item.extraStatus.text(obj["extraStatusMsg"]).removeClass("hidden")
		}
		if(obj["statusMsg"]) {
			item.statusMsg.attr({
				"data-attribute": aData["timestamp"],
				"title": obj["message"]
			}).removeClass("hidden")
		}

		if(aData["cnfi"]) {
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
		if(!aData["refreshable"]){
			// var publishedDate=aData[""];
			// var currentDate						
			var diff="7"	
			item.refresh.attr("title", 'You can refresh this job after '+diff+' days')
		}	
		item.edit.attr("data-job-isEditable", aData["editable"])
		item.edit.attr("href","/job/"+aData["id"]+"/edit")
		if(!aData["editable"]) {
			item.edit.attr("title","This job cannot be edited now. Reach us at hello@iimjobs.com in case of any issue.");
		}

		item.premium.attr("data-job-isPremium", aData["premium"]);
		if(aData["premium"]) {
			item.premium.find('.icon-star').addClass('hidden');
			item.premium.find('.icon-star-2').removeClass("hidden");
			item.premium.attr('title','Premium Job');

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
		if(type != settings.type) {
			return
		}
		var str = '';
		hideShell()
		hideEmptyView();
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
		initializeTooltip()
		if(dataArray.length< pageContent) {
			if(settings.rowContainer.find(".no-more-records").length == 0) {
                return settings.rowContainer.append("<div class='no-more-records no-data'>You have reached the end of the list</div>")
            }
        }

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

	function showSpinner(type) {
		if(type == "refresh") {
			settings.jobRefreshButton.addClass('hidden')
			settings.jobRefreshModal.find(".spinner").removeClass("hidden")
			return
		}
		if(type == "unpublish") {
			settings.jobUnpublishButton.addClass('hidden')
			settings.jobUnpublishModal.find(".spinner").removeClass("hidden")
			return
		}
		settings.jobMakePremiumButton.addClass('hidden')
		settings.jobMakePremiumModal.find(".spinner").removeClass('hidden')
	}

	function hideSpinner(type){
		if(type == "refresh") {
			settings.jobRefreshButton.removeClass('hidden')
			settings.jobRefreshModal.find(".spinner").addClass("hidden")
			return
		}
		if(type == "unpublish") {
			settings.jobUnpublishButton.removeClass('hidden')
			settings.jobUnpublishModal.find(".spinner").addClass("hidden")
			return
		}
		settings.jobMakePremiumButton.removeClass('hidden')
		settings.jobMakePremiumModal.find(".spinner").addClass('hidden')
	}

	function closeModal() {
		removeBodyFixed()
		$(".modal").addClass("hidden")
		
	}

	function hideEmptyView() {
		settings.emptyView.addClass("hidden")
		settings.headings.removeClass('hidden');
		settings.jobFilters.removeClass('hidden');
	}

	return {
		init: init,
		addToList: addToList,
		onClickJobEdit: onClickJobEdit,
		onClickSubmitUnpublishJob: onClickSubmitUnpublishJob,
		onClickSubmitRefreshJob: onClickSubmitRefreshJob,
		setConfig : setConfig,
		onClickJobMakePremium: onClickJobMakePremium,
		onClickSubmitPremiumJob: onClickSubmitPremiumJob,
		onChangeJobFilters: onChangeJobFilters,
		hideShell: hideShell,
		showShell: showShell,
		emptyList: emptyList,
		hideEmptyView: hideEmptyView,
		getType: getType,
		showSpinner: showSpinner,
		hideSpinner: hideSpinner,
		closeModal: closeModal
	}

	function initializeTooltip() {
		if(window.innerWidth<=768){
			$(".tooltip").not(".prototype .tooltip").tooltipster({
				animation: 'fade',
				delay: 0,
				side:['bottom'],
				theme: 'tooltipster-borderless',
				maxWidth: 500,
				trigger:'click'
			})
		}
		else{
			$(".tooltip").not(".prototype .tooltip").tooltipster({
				animation: 'fade',
				delay: 0,
				side:['bottom'],
				theme: 'tooltipster-borderless',
				maxWidth: 500
			})
		}
	}

}
