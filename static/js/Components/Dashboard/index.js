var dataModel = {};
dataModel.revisit = false;
profile.lastSeen = moment().subtract(1, 'days').format("x");
var settings = {}

function Notifications(){
	var settings ={};
	settings.notificationContainer= $('#notificationContainer');
	settings.notificationRowClass = ".notificationRow";
	settings.candidateShortlistButtonClass = '.candidateShortlist';
	settings.candidateRejectButtonClass = '.candidateReject';

	function onClickShortlistCandidate(fn) {
	   settings.notificationContainer.on('click', settings.candidateShortlistButtonClass, function(event) {
	        var status = $(this).attr("data-status");
	        var applicationId = $(this).closest(settings.notificationRowClass).attr("data-application-id")
	        var jobId = $(this).closest(settings.notificationRowClass).attr('data-job-id');
	        return fn(applicationId, jobId);
	        
	    })
	}
	function candidateActionTransition(applicationId){
		 settings.notificationContainer.find(settings.notificationRowClass+'[data-application-id="'+applicationId+'"]').remove();
		 if(settings.notificationContainer.find(settings.notificationRowClass).length <1)
		 	settings.notificationContainer.addClass('hidden');
	}
	return {
		onClickShortlistCandidate: onClickShortlistCandidate,
		candidateActionTransition: candidateActionTransition
	}
}

function modalInit(){
	settings.openJobUnpublishModalButton= '.jobUnpublish';
	settings.openJobRefreshModalButton= '.jobRefresh';
	settings.jobUnpublishModal= $('.unpublishModal');
	settings.jobUnpublishButton= $('.jobUnpublishButton');
	settings.jobRefreshModal= $(".refreshModal");
	settings.jobRefreshButton= $(".jobRefreshButton");
}


$(document).ready(function(){
	var dashboardStatsContainer = $("#dashboardStatsContainer");
	var activeJobsChartContainer = $("#new-jobs-chart");
	var jobRowCard = $(".jobRow.prototype");
	var notificationCard = $(".prototype.notificationRow")
	var greetingsContainer = $(".dashboard .header-row");
	var notificationContainer = $('#notificationContainer');
	var seeMoreSection = $('.seeMoreSection.prototype');
	var otherRolesContainer = $("#otherRolesContainer");
	var recentJobsContainer = $("#recentJobsContainer");
	var postedJobsContainer = $("#postedJobsContainer");
	var jobOtherActionsClass = ".action-panel";


	modalInit();
	onClickJobRefresh();
	onClickJobCancel();
	var notificationOb = Notifications();
	notificationOb.onClickShortlistCandidate(function(applicationId, jobId){
		console.log(applicationId);
		console.log(jobId);
		setCandidateAction(recruiterId, jobId, "shortlist" , applicationId, {});
	})
	function onSuccessfullCandidateAction(topic, res) {
        if(res.action == "shortlist") {
        	notificationOb.candidateActionTransition(res.applicationId);
            return toastNotify(1, "Shortlisted Successfully")
        }
        if(res.action == "reject") {
        	notificationOb.candidateActionTransition(res.applicationId);
        	return toastNotify(1, "Rejected Successfully")
        }
    }

	$(window).click(function(event) {
		$(jobOtherActionsClass).addClass('inactive');
	});

	dataModel.greetingText = {
		"morning": ""
	}
	dataModel.greetingSubText = {
		"noActiveJob": "It’s quite silent around here. Get started - Post Jobs/Discover Candidates/Build your Brand",
		"busy": "It looks busy around here! Good luck for your day ahead! ",
		"revisit": "We missed you while you were away! To keep you up-to-date, here is a quick glance of what has changed - ",
		default: ""
	}

	function onClickJobOtherActions() {
		recentJobsContainer.on('click', jobOtherActionsClass, function(e){
			var hasClass = $(this).hasClass('inactive');
			$(jobOtherActionsClass).addClass('inactive');
			if(hasClass){
				$(this).removeClass('inactive');
			}
			e.stopPropagation();
		})
    }

	function onClickJobRefresh(fn) {
		recentJobsContainer.on('click', settings.openJobRefreshModalButton,function(e) {
			e.preventDefault()
				var jobId = $(this).attr("data-job-id");
				settings.jobRefreshModal.removeClass('hidden');
				settings.jobRefreshButton.attr('data-refresh-job-id', jobId);
				
			return false;
		})
	}
	function onClickJobCancel(fn){
		recentJobsContainer.on('click',settings.openJobUnpublishModalButton,function(e){
			e.preventDefault();
			settings.jobUnpublishModal.find("input:radio[name='unpublishReason']:checked").prop('checked', false);
			settings.jobUnpublishButton.attr('data-unpublish-job-id', '');
			var jobId = $(this).attr("data-job-id");
			settings.jobUnpublishModal.removeClass('hidden');
			settings.jobUnpublishButton.attr('data-unpublish-job-id', jobId);
			return false;
		});
	}

	settings.jobUnpublishButton.click(function(e){
		var jobId= $(this).attr('data-unpublish-job-id');
		var reason = settings.jobUnpublishModal.find("input:radio[name='unpublishReason']:checked").attr('id');
		if(!reason){
			settings.jobUnpublishModal.find('.error').removeClass('hidden');
			return
		}
		submitUnpublishJob(recruiterId, jobId, {reasonId: reason});

	})
	settings.jobRefreshButton.click(function(e) {
		var jobId = $(this).attr('data-refresh-job-id');
		submitRefreshJob(recruiterId, jobId);
	});


    onClickJobOtherActions();

	var candidateApplyUrl = "/candidate-apply-list/:publishedId?type=:status";
	function onStatsUpdate(topic, data){
		data.forEach(function(aData){
			dashboardStatsContainer.find(".block."+aData['label']+' .number').text(aData['value']);
			if(aData['label']=='activeJobs' && !dataModel.revisit ){
				if(aData['value'] < 1)
					return updateSubGreetings(dataModel.greetingSubText['noActiveJob'])
				if(aData['value'] > 10)
					return updateSubGreetings(dataModel.greetingSubText['busy']);
				return updateSubGreetings(dataModel.greetingSubText['default']);
			}
		})
	};
	var dashboardStatsSubscription = pubsub.subscribe("fetchedDashboardStats", onStatsUpdate);

	function onActiveJobStatsUpdate(topic, data){
		 var temp = [
	        ['Active jobs', 'Shortlisted', 'Reviewed', 'Saved', 'Rejected']
	    ];
	    data.forEach(function(aJob){
	        temp.push([
	            aJob["title"] || 0,
	            aJob["shortlist"] || 0,
	            (aJob["view"] || 0)+ (aJob["download"] || 0),
	            aJob["save"] || 0,
	            aJob["reject"]
	            ])
	    })
	    dataModel[topic] = temp;
	    if(temp.length >1){
	    	postedJobsContainer.removeClass('hidden')
	    	drawBarChartGraph(temp, activeJobsChartContainer.attr('id'));
	    	$(window).resize(function(){
	    		drawBarChartGraph(dataModel[topic], activeJobsChartContainer.attr('id'));
	    	})
	    }
	}
	var activeJobStatsSubscription = pubsub.subscribe("fetchedActiveJobStats", onActiveJobStatsUpdate)

	function onLoadChartLibrary(topic, data){
		console.log("calling onLoadChartLibrary");
	    fetchActiveJobStats(recruiterId);
	}
	var chartLibraryLoadSubscription = pubsub.subscribe("loadedChartLibrary", onLoadChartLibrary)
	function onFetchJobs(topic, data){
		console.log(data)
		var len = data.length;
		data.forEach(function(aJob, index){
			var card = jobRowCard.clone().removeClass('hidden prototype');
			var experience = aJob['exp']['min']+'-'+aJob['exp']['max']+'yrs'
			card.find(".title .text").text(aJob['title']).attr('href', '/job/'+aJob['id']);
			var locationTitle = (aJob["location"] && aJob["location"].length >3) ? aJob["location"].join(','): null;
			var location = (aJob["location"] && aJob["location"].length >3) ? "Multiple" : aJob["location"].join(',');
			card.find(".title .meta-content .location .label").text(location).attr('title', locationTitle);
			card.find(".title .meta-content .experience .label").text(experience)
			card.find(".title .meta-content .postedOn .label").text(moment(aJob['created']).format('D MMM YYYY'));
			card.find(".stats .totalApplications .value").text(aJob["totalApplications"]).attr('href', candidateApplyUrl.replace(':publishedId', aJob['publishedId']).replace(':status', 'all'));
			card.find(".stats .newApplications .value").text(aJob["newApplications"]).attr('href', candidateApplyUrl.replace(':publishedId', aJob['publishedId']).replace(':status', 'all'));
			var url = baseUrlJob + aJob["url"];

			card.find('.action-panel .action-list-items .jobRefresh').attr("data-job-id", aJob['id']);
			card.find('.action-panel .action-list-items .jobUnpublish').attr("data-job-id", aJob['id']);
			card.find('.action-panel .action-list-items .jobFacebook').attr("href", getFacebookShareLink(url))
			card.find('.action-panel .action-list-items .jobTwitter').attr("href", getTwitterShareLink(url))
			card.find('.action-panel .action-list-items .jobLinkedin').attr("href", getLinkedInShareUrl(url))
			if(len-1 == index)
				card.find('.horizontal-separator').addClass('hidden');
			recentJobsContainer.find('.detail-card').append(card);
		});
		if(data.length >0 )
			recentJobsContainer.removeClass('hidden')
	}
	var fetchJobsSubscription = pubsub.subscribe("fetchedJobs", onFetchJobs);

	function onVisit(){
		var recruiterName = profile.name;
		var lastSeen = profile.lastSeen;
		var now = Date.now();
		var text = "Welcome, "+recruiterName; // TODO: get recruitername from the recruiterobject;
		if(now - lastSeen > 72*60*60*1000){
			text = "Welcome back, "+recruiterName;
			dataModel.revisit = true;
			updateSubGreetings(dataModel.greetingSubText['revisit']);
		}
		else{
			var currentHour = moment(now).hour();
			if( currentHour > 5 && currentHour < 12	)
				text = "Good Morning, "+recruiterName
			if( currentHour > 11 && currentHour < 17 )
				text = "Good Afternoon, "+recruiterName
			if( currentHour > 17 && currentHour < 5 )
				text = "Good Evening, "+recruiterName
		}
		var data = {
			text: text,
			icon: "/static/images/morning-icon.png"
		}
		updateGreetings(data);
	}

	function updateGreetings(data){
		var img = '<img class="salutation-icon" src="'+data.icon+'">';
		var text = data.text;
		greetingsContainer.find(".heading").html(img+text);
	}

	function updateSubGreetings(data){
		greetingsContainer.find(".sub-heading").html(data);
	}


	var visitSubscription= pubsub.subscribe("pageVisit", onVisit);
	var greetingsUpdateSubscription = pubsub.subscribe("greetingsUpdate", updateGreetings);

	function onFetchFollowUps(topic, data){
		var isMultiple = true;
		//Debugging for single view
		// data = data.concat(data)
		var totalFollowups = data.length;
		if(data.length ==1)
			isMultiple = false
		var showCount = 4
		data.forEach(function(aRow, index){
			if(index>showCount){
				return;
			}
			var card = notificationCard.clone().removeClass('hidden prototype');
			card.attr('data-application-id', aRow['id']);
			card.attr('data-job-id', aRow['jobId']);
			if(!isMultiple){
				card.removeClass('multiple');
				card.find('.general .designationOrganization').addClass('hidden');
				card.find('.horizontal-separator').addClass('hidden')
				card.find('.profile').addClass('highlighted-profile');
				card.find('.profile .jobDetailsContainer').addClass('hidden');
			}
			var designationOrganization = aRow['jobs'][0]['designation'] + ' at '+ aRow['jobs'][0]['organization'];
				var currentFromMonth = moment().month(parseInt(aRow['jobs'][0]["exp"]['from']['month']) -1).format('MMM');
			var currentFromYear = aRow['jobs'][0]["exp"]['from']['year'] ;
			var currentToMonth = (aRow['jobs'][0]["exp"]['to']['month'])? moment().month(parseInt(aRow['jobs'][0]["exp"]['to']['month']) -1).format('MMM') : "";
			var currentToYear = (aRow['jobs'][0]["exp"]['to']['year'])? aRow['jobs'][0]["exp"]['to']['year'] : "" ;
			var currentExperienceText= currentToMonth + '-'+ currentToYear ;
			if(currentToMonth==0 || currentToYear==0)
				currentExperienceText = "Present"

			var designationExperience = currentFromMonth+ '-'+ currentFromYear + ' to ' + currentExperienceText;
			// (function(fromExp, toExp){
			// 	fromExp = fromExp.split('-');
			// 	toExp = toExp.split('-');
			// 	fromExp = moment().month(fromExp[0]).format('MMM')+' - '+ fromExp[1];
			// 	toExp = moment().month(toExp[0]).format('MMM')+' - '+ toExp[1];
			// 	return fromExp + ' to ' + toExp;

			// })(aRow["currentExperience"]['fromExp'],aRow['toExp'])
			var locationExperience = (function(exp, location){
				exp = exp["year"] +'y '+ exp["month"] + 'm'
				return location+', ' +exp;
			})(aRow['exp'], aRow['currentLocation'])
			card.find('.profile .name').text(aRow['name']).attr('href', '/job/'+aRow['jobId']+'/applications/'+aRow['id']);
			card.find('.profile .icon img').attr('src', (aRow['img'])?aRow['img'] : "/static/images/noimage.png"  );
			card.find('.profile .designationOrganization').text(designationOrganization);
			card.find('.profile .locationExperience').text(locationExperience);
			card.find('.profile-detail .profession .designationOrganization').text(designationOrganization)
			card.find('.profile-detail .profession .designationExperience').text(designationExperience);
			card.find('.profile-detail .education .institute').text(aRow['institute']);
			card.find('.profile-detail .education .batch').text(aRow['batch']);
			card.find('.profile-detail .education .courseType').text(aRow['courseType']);
			card.find('.profile .jobDetails').text(aRow['title']);
			card.find('.profile-detail .jobDetails').text(aRow['title']);
			if(index==totalFollowups-1 &&  showCount >=index){
				card.find('.horizontal-separator').addClass('hidden')
			}
			notificationContainer.find('.detail-card').append(card);
		});
		if( data.length-1>showCount){
			var seeMore= seeMoreSection.clone().removeClass('hidden prototype');
			seeMore.find(".seeAll a").attr('href', '/followUps')
			notificationContainer.find('.detail-card').append(seeMore);
		}
		if( data.length>0){
			notificationContainer.removeClass('hidden');
		}

	}
	var followUpsUpdateSubscription = pubsub.subscribe("fetchedFollowups", onFetchFollowUps);

	function onFetchInterviews(topic, data){
		var totalInterviews = data.length;
		var showCount = 4;
		var lastDate =(data[0] && data[0]['slot'] )? moment(data[0]['slot']['date']).format('YYYY-MM-DD') : null;
		var interviewContainer = $('#interviewContainer');
		var interviewRowCard = $(".interviewRow.prototype");
		if(totalInterviews<1){
			$('.single-interview').removeClass('hidden');
			interviewContainer.find('.interviewRow').removeClass('hidden')
		}
		var interviewCandidateCard = $('.interviewCandidateRow.prototype');
		var card = interviewRowCard.clone().removeClass('hidden prototype');
		data.forEach(function(aRow, index){
			if(index>showCount)
				return
			if(index>0 && lastDate != moment(aRow['slot']['date']).format('YYYY-MM-DD')){
				lastDate = moment(aRow['slot']['date']).format('YYYY-MM-DD')
					interviewContainer.find('.detail-card').append(card);
				card = interviewRowCard.clone().removeClass('hidden prototype');
			}
			var slotDate = moment(aRow['slot']['date']);
			var slotTime = moment(aRow['slot']['time'], 'hhmm')
			card.find('.profile .custom-icon .number').text(slotDate.date());
			card.find('.profile .custom-icon .label').text(slotDate.format('MMM'));

			var candidateCard = interviewCandidateCard.clone().removeClass('hidden prototype');
			candidateCard.find('.highlighted-meta').text(slotTime.format('hh:mm A') + ' - '+ slotTime.add(30, 'minutes').format('hh:mm A'));
			candidateCard.find('.name').text(aRow['name']);
			candidateCard.find('.designation').text(aRow['designation']);
			candidateCard.find('.organization').text(aRow['organization']);
			if(index==totalInterviews-1 &&  showCount >=index){
				card.find('.horizontal-separator').addClass('hidden')
			}
			card.find('.general').append(candidateCard)
			interviewContainer.find('.detail-card').append(card);	
		})
		if( totalInterviews>showCount){
			var seeMore= seeMoreSection.clone().removeClass('hidden prototype');
			seeMore.find(".seeAll a").attr('href', '/interviews')
			interviewContainer.find('.detail-card').append(seeMore);
		}
	}


	var fetchInterviewsSubscription = pubsub.subscribe("fetchedInterviews", onFetchInterviews);

	var setCandidateActionSuccessSubscription = pubsub.subscribe("setCandidateActionSuccess", onSuccessfullCandidateAction)

	function init(){
		pubsub.publish("pageVisit", 1);
		// fetchDashboardStats(recruiterId);
		// fetchJobs("published", recruiterId, 5,1);
		// fetchFollowUps(recruiterId);
		fetchInterviews(recruiterId, {pageContent: 6, pageNumber: 1, status: 2});
	}
	init()

})
