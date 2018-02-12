function Jobs() {

	var settings = {
		rowContainer: $('.jobRowList'),
		jobFilters: $('#jobFilters'),
		jobEditButton: '.jobEdit',
		openJobUnpublishModalButton: '.unpublishModalButton',
		openJobRefreshModalButton: '.refreshModalButton',
		openMakeJobPremiumModalButton: '.makePremiumModalButton',
		jobUnpublishModal: $('.unpublishModal'),
		jobUnpublishButton: $('.jobUnpublishButton'),
		jobRefreshModal: $(".refreshModal"),
		jobRefreshButton: $(".jobRefreshButton"),
		jobMakePremiumModal: $(".premiumModal"),
		jobMakePremiumButton: $(".jobMakePremiumButton")
	};

	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}

	function onClickJobCancel(fn){
		settings.rowContainer.on('click',settings.openJobUnpublishModalButton,function(e){
			var jobId = $(this).attr("data-id");
			settings.jobUnpublishModal.removeClass('hidden');
			settings.jobUnpublishButton.click(fn);
			return false;
		});
	}

	function onClickJobEdit() {
		settings.rowContainer.on('click', settings.jobEditButton ,function(e) {
			return parseInt($(this).attr('data-editable')) ? true : false;
		})
	}

	function onClickJobRefresh(fn) {
		settings.rowContainer.on('click', settings.openJobRefreshModalButton,function(e) {
			if(parseInt($(this).attr("data-refresh"))) {
				var jobId = $(this).attr("data-id");
				settings.jobRefreshModal.removeClass('hidden');
				settings.jobRefreshButton.click(fn);
			}
			return false;
		})
	}

	function onClickJobMakePremium(fn) {
		settings.rowContainer.on('click', settings.openMakeJobPremiumModalButton,function(event) {
			if(parseInt($(this).attr("data-premium"))) {
				return false;
			}
			var jobId = $(this).attr("data-id");
			if(config["availableCredits"] > 0) {
				settings.jobMakePremiumButton.click(fn)
				settings.jobMakePremiumButton.removeClass("hidden")
				settings.jobMakePremiumModal.find(".section.modal_text").text("This job will be highlighted and moved to top of the list for 15 days starting today. You will have "+(parseInt(config["availableCredits"]) - 1)+" credits left.")
				settings.jobMakePremiumModal.removeClass('hidden');
				return false
			}
			settings.jobMakePremiumModal.find(".js_modalText").text("Reach out to more candidates in less amount of time by making your job premium.")
			settings.jobMakePremiumModal.find(".section.modal_text").text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
			settings.jobMakePremiumModal.removeClass('hidden');
			//shootEmail()
			return false;
		})
	}

	function onChangeJobFilters(fn) {
		settings.jobFilters.change(function() {
			var status = $(this).val();
		    return fn(status);
		})
	}

	function cloneElement(id) {
		var card = $('.table-row.job.prototype').clone().removeClass('prototype hidden')
		card.attr('id', 'job-'+id);
		return {
			element: card,
			createdOn: card.find('.js_createdOn'),
			title: card.find('.js_title'),
			location: card.find('.js_location'),
			multipleLocation: card.find('.js_multipleLocation'),
			seperator: card.find('.js_seperator'),
			experience: card.find('.js_experience'),
			status: card.find('.js_status'),
			statusMsg: card.find('.js_status_msg'),
			views: card.find('.js_views'),
			applications: card.find('.js_applications'),
			edit: card.find(settings.jobEditButton),
			cancel: card.find(settings.openJobUnpublishModalButton),
			refresh: card.find(settings.openJobRefreshModalButton),
			premium: card.find(settings.openMakeJobPremiumModalButton),
			facebook: card.find('.jobFacebook'),
			twitter: card.find('.jobTwitter'),
			linkedIn: card.find('.jobLinkedin')
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
				if(aData["rej_msg"]){
					obj["message"] = aData["rej_msg"];
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
		item.element.find('.action-icon').attr('data-id',aData["id"]);

		var loc = aData["loc"];
		var locShow = loc.toString();
		if(loc.length) {
			item.seperator.removeClass("hidden")
			(loc.length <= 3) ? item.location.append("<span>"+locShow+"</span>") : item.multipleLocation.attr("title",locShow).removeClass("hidden");
		}

		var experience = aData["exp"]['min']+'-'+aData['exp']['max'] +' yrs'
		item.experience.text(experience);

		var obj = setJobStatus(aData)
		item.status.append(obj["status"]);
		if(obj["statusMsg"]) {
			item.statusMsg.attr({
				"data-attribute": aData["timestamp"],
				"title": obj["message"]
			}).removeClass("hidden")
		}

		if(obj["actions"]) {
			item.element.find(".jobActions").removeClass("hidden");
		}

		if(aData['views']){
			item.views.text(aData['views']+' Views');
			if(aData['totalApplications'])
				item.applications.html('<a class="link-color" href="candidate-apply-list/'+aData["publishedId"]+'">'+aData["totalApplications"]+' Applied</a>');
			item.element.find(".js_engagement").removeClass("hidden");
			item.element.find(".js_engagement_default").addClass("hidden");
		}


		item.refresh.attr("data-refresh", aData["refresh"])
		if(!aData["refresh"])
			item.refresh.attr("title", "You can refresh this job after 7 days")

		item.edit.attr("data-editable", aData["editable"])
		item.edit.attr("href","/post-job?jobId="+aData["id"]+"")
		if(!aData["editable"]) {
			item.edit.attr("title","This job cannot be edited now. Reach us at hello@iimjobs.com in case of any issue.");
		}

		item.premium.attr("data-premium", aData["premium"]);
		if(aData["premium"]) {
			item.premium.find('.icon-star').addClass("premium_highlight");
		}

		return item;
	}


	function init(data){
		addToList(data);
		jQuery(".tooltip").tooltipster( {
				animation: 'fade',
				delay: 0,
				side:['right'],
				theme: 'tooltipster-borderless'
			});
	}

	function addToList(dataArray){
		var str = '';
		dataArray.forEach(function(aData){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
		});
		settings.rowContainer.html(str);
	}

	return {
		init: init,
		add: addToList,
		onClickJobEdit: onClickJobEdit,
		onClickJobCancel: onClickJobCancel,
		onClickJobRefresh: onClickJobRefresh,
		setConfig : setConfig,
		onClickJobMakePremium: onClickJobMakePremium,
		onChangeJobFilters: onChangeJobFilters
	}
}
