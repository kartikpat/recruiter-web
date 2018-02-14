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
		$(".header .menu-list-item.my-jobs").addClass("active");
	}

	function onClickJobCancel(fn){
		settings.rowContainer.on('click',settings.openJobUnpublishModalButton,function(e){
			var jobId = $(this).attr("data-job-id");
			settings.jobUnpublishModal.removeClass('hidden');
			settings.jobUnpublishButton.click(fn);
			return false;
		});
	}

	function onClickJobEdit() {
		settings.rowContainer.on('click', settings.jobEditButton ,function(e) {
			return parseInt($(this).attr('data-job-isEditable')) ? true : false;
		})
	}

	function onClickJobRefresh(fn) {
		settings.rowContainer.on('click', settings.openJobRefreshModalButton,function(e) {
			if(parseInt($(this).attr("data-job-refreshable"))) {
				var jobId = $(this).attr("data-job-id");
				settings.jobRefreshModal.removeClass('hidden');
				settings.jobRefreshButton.click(fn);
			}
			return false;
		})
	}

	function onClickJobMakePremium(fn) {
		settings.rowContainer.on('click', settings.openMakeJobPremiumModalButton,function(event) {
			if(parseInt($(this).attr("data-job-isPremium"))) {
				return false;
			}
			var jobId = $(this).attr("data-job-id");
			if(config["availableCredits"] > 0) {
				settings.jobMakePremiumButton.click(fn)
				settings.jobMakePremiumButton.removeClass("hidden")
				settings.jobMakePremiumModal.find(".modalTextSecondary").text("This job will be highlighted and moved to top of the list for 15 days starting today. You will have "+(parseInt(config["availableCredits"]) - 1)+" credits left.")
				settings.jobMakePremiumModal.removeClass('hidden');
				return false
			}
			settings.jobMakePremiumModal.find(".modalTextPrimary").text("Reach out to more candidates in less amount of time by making your job premium.")
			settings.jobMakePremiumModal.find(".modalTextSecondary").text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
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
		console.log(item.element[0].outerHTML);
		var title = getTitleFormat(aData["title"], (/\(\d+-\d+ \w+\)$/));
		item.createdOn.text(getDateFormat(aData["created"]))
		item.title.text(title)
		item.element.find('.action-icon').attr('data-job-id',aData["id"]);

		var loc = aData["loc"];
		var locShow = loc.toString();
		if(loc.length) {
			item.metaSeperator.removeClass("hidden");
			if(loc.length <= 3){
				item.location.append("<span>"+locShow+"</span>")
			}
			else{
				item.multipleLocation.attr("title",locShow).removeClass("hidden");
			}
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
			item.element.find(".engagement").removeClass("hidden");
			item.element.find(".engagementDefault").addClass("hidden");
		}


		item.refresh.attr("data-job-refreshable", aData["refreshable"])
		if(!aData["refreshable"])
			item.refresh.attr("title", "You can refresh this job after 7 days")

		item.edit.attr("data-job-isEditable", aData["editable"])
		item.edit.attr("href","/post-job?jobId="+aData["id"]+"")
		if(!aData["editable"]) {
			item.edit.attr("title","This job cannot be edited now. Reach us at hello@iimjobs.com in case of any issue.");
		}

		item.premium.attr("data-job-isPremium", aData["premium"]);
		if(aData["premium"]) {
			item.premium.find('.icon-star').addClass("premium_highlight");
		}

		if(aData["url"]) {
			var url = config["baseUrlJob"] + aData["url"];
			item.facebook.attr("href", getFacebookShareLink(url))
			item.twitter.attr("href", getTwitterShareLink(url))
			item.linkedIn.attr("href", getLinkedInShareUrl(url))
		}

		return item;
	}

	function addToList(dataArray){
		var str = '';
		dataArray.forEach(function(aData){
			var item = createElement(aData);
			str+=item.element[0].outerHTML;
		});
		settings.rowContainer.html(str);
		initializeTooltip()
	}

	return {
		init: init,
		addToList: addToList,
		onClickJobEdit: onClickJobEdit,
		onClickJobCancel: onClickJobCancel,
		onClickJobRefresh: onClickJobRefresh,
		setConfig : setConfig,
		onClickJobMakePremium: onClickJobMakePremium,
		onChangeJobFilters: onChangeJobFilters
	}

	function initializeTooltip() {
		 $(".tooltip").not(".prototype .tooltip").tooltipster({
			animation: 'fade',
			delay: 0,
			side:['right'],
			theme: 'tooltipster-borderless'
		})
	}

}

// Sample link
// <a href="https://www.facebook.com/sharer/sharer.php?u=" target="_blank">Share</a>

function getFacebookShareLink(url){
	return "https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url);
}

function getTwitterShareLink(url){
	return "https://twitter.com/share?url="+encodeURIComponent(url);
	// "http://twitter.com/share?text=text goes here&url=http://url goes here&hashtags=hashtag1,hashtag2,hashtag3"
}

function getLinkedInShareUrl(url){
	return "https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(url)

	// TO create a link with all parameters
	// "https://www.linkedin.com/shareArticle?mini=true&url=<?php the_permalink(); ?>&title=Some%20Title&summary=Some%20Summary&source=YourWebsiteName"
}
