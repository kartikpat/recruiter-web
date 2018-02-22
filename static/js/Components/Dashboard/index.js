var dataModel = {};
dataModel.revisit = false;
profile.lastSeen = moment().subtract(1, 'days').format("x");
var settings = {}

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
	var jobOtherActionsClass = ".action-panel"

	modalInit();
	onClickJobRefresh();
	onClickJobCancel();

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
			$(this).toggleClass("inactive");
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
			aJob["location"] = ['Delhi', 'Chandigarh', 'Mumbai', 'Chennai']
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
		if(data.length ==1)
			isMultiple = false

		data.forEach(function(aRow, index){
			if(index>4){
				return;
			}
			var card = notificationCard.clone().removeClass('hidden prototype');
			if(!isMultiple){
				card.removeClass('multiple');
				card.find('.general .designationOrganization').addClass('hidden');
				card.find('.horizontal-separator').addClass('hidden')
				card.find('.profile').addClass('highlighted-profile')
			}
			var designationOrganization = aRow['designation'] + ' at '+ aRow['organization'];
			var currentFromMonth = moment().month(parseInt(aRow['currentExp']['from']['month']) -1).format('MMM');
			var currentFromYear = aRow['currentExp']['from']['year'] ;
			var currentToMonth = (aRow['currentExp']['to']['month'])? moment().month(parseInt(aRow['currentExp']['to']['month']) -1).format('MMM') : "";
			var currentToYear = (aRow['currentExp']['to']['year'])? aRow['currentExp']['to']['year'] : "" ;
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
			})(aRow['exp'], aRow['location'])
			card.find('.profile .name').text(aRow['name']).attr('href', '/job/'+aRow['jobId']+'/candidates/'+aRow['userId']);
			card.find('.profile .icon img').attr('src', (aRow['img'])?aRow['img'] : "/static/images/noimage.png"  );
			card.find('.profile .designationOrganization').text(designationOrganization);
			card.find('.profile .locationExperience').text(locationExperience);
			card.find('.profile-detail .profession .designationOrganization').text(designationOrganization)
			card.find('.profile-detail .profession .designationExperience').text(designationExperience);
			card.find('.profile-detail .education .institute').text(aRow['institute']);
			card.find('.profile-detail .education .batch').text(aRow['batch']);
			card.find('.profile-detail .education .courseType').text(aRow['courseType']);
			card.find('.action-buttons .button').attr('href', aRow['resume']).attr('download', aRow['name'].replace(/ +/g, '_').toLowerCase()+'_resume.pdf').attr('target', '_blank');
			notificationContainer.find('.detail-card').append(card);
		});
		if( data.length>4){
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
		var isMultiple = true;
		if(data.length ==1)
			isMultiple = false
		var lastDate =(data[0] && data[0]['slot'] )? data[0]['slot'] : null;
		var interviewContainer = $('#interviewContainer');
		var interviewRowCard = $(".interviewRow.prototype");
		var interviewCandidateCard = $('.interviewCandidateRow.prototype');
		var card = interviewRowCard.clone().removeClass('hidden prototype');
		data.forEach(function(aRow, index){
			if(index>4)
				return
			if(lastDate != aRow['slot']['date']){
				lastDate = aRow['slot']['date'];
				interviewContainer.find('.detail-card').append(card);
				interviewContainer.find('.detail-card').append('')
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
			card.find('.general').append(candidateCard)
		})
		interviewContainer.find('.detail-card').append(card);
		if( data.length>4){
			var seeMore= seeMoreSection.clone().removeClass('hidden prototype');
			seeMore.find(".seeAll a").attr('href', '/interviews')
			interviewContainer.find('.detail-card').append(seeMore);
		}
		if( data.length>0){
			interviewContainer.removeClass('hidden');
		}
	}


	var fetchInterviewsSubscription = pubsub.subscribe("fetchedInterviews", onFetchInterviews);

	function init(){
		pubsub.publish("pageVisit", 1);
		fetchDashboardStats(recruiterId);
		fetchJobs("published", recruiterId);
		fetchFollowUps(recruiterId);
		fetchInterviews(recruiterId, {pageContent: 6, pageNumber: 1, status: 2, from: moment().format()});
	}
	init()

})
