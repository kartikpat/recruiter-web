var dataModel = {};
$(document).ready(function(){
	var dashboardStatsContainer = $("#dashboardStatsContainer");
	var activeJobsChartContainer = $("#new-jobs-chart");
	var jobRowCard = $(".jobRow.prototype");
	var notificationCard = $(".prototype.notificationRow")
	var greetingsContainer = $(".dashboard .header-row");
	var notificationContainer = $('#notificationContainer');
	var seeMoreSection = $('.seeMoreSection.prototype');

	var candidateApplyUrl = "/candidate-apply-list/:publishedId?type=:status";
	function onStatsUpdate(topic, data){
		data.forEach(function(aData){
			dashboardStatsContainer.find(".block."+aData['label']+' .number').text(aData['value']);
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
	    drawBarChartGraph(temp, activeJobsChartContainer.attr('id'));
	}
	var activeJobStatsSubscription = pubsub.subscribe("fetchedActiveJobStats", onActiveJobStatsUpdate)

	function onLoadChartLibrary(topic, data){
		console.log("calling onLoadChartLibrary");
	    fetchActiveJobStats();
	}
	var chartLibraryLoadSubscription = pubsub.subscribe("loadedChartLibrary", onLoadChartLibrary)
	function onFetchJobs(topic, data){
		console.log(data)
		var len = data.length;
		data.forEach(function(aJob, index){
			var card = jobRowCard.clone().removeClass('hidden prototype');
			var experience = aJob['min']+'-'+aJob['max']+'yrs'
			card.find(".title .text").text(aJob['title']);
			card.find(".title .meta-content .location .label").text(aJob["loc"])
			card.find(".title .meta-content .experience .label").text(experience)
			card.find(".title .meta-content .postedOn .label").text(moment(aJob['created']).format('D MMM YYYY'));
			card.find(".stats .totalApplications .value").text(aJob["totalApplications"]).attr('href', candidateApplyUrl.replace(':publishedId', aJob['publishedId']).replace(':status', 'all'));
			card.find(".stats .newApplications .value").text(aJob["newApplications"]).attr('href', candidateApplyUrl.replace(':publishedId', aJob['publishedId']).replace(':status', 'all'));
			if(len-1 == index)
				card.find('.horizontal-separator').addClass('hidden');
			$('#recentJobsContainer .detail-card').append(card);
		});
	}
	var fetchJobsSubscription = pubsub.subscribe("fetchedJobs:published", onFetchJobs);

	function onVisit(){
		var recruiterName = 'Shreya Jain';
		var lastSeen = 1515749878943;
		var now = Date.now();
		var text = "Welcome, "+recruiterName; // TODO: get recruitername from the recruiterobject;
		if(now - lastSeen > 72*60*60*1000){
			text = "Welcome back, "+recruiterName
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
		pubsub.publish("greetingsUpdate", data);
	}

	function updateGreetings(topic, data){
		var img = '<img class="salutation-icon" src="'+data.icon+'">';
		var text = data.text;
		greetingsContainer.find(".heading").html(img+text);
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
			var designationExperience = (function(fromExp, toExp){
				fromExp = fromExp.split('-');
				toExp = toExp.split('-');
				fromExp = moment().month(fromExp[0]).format('MMM')+' - '+ fromExp[1];
				toExp = moment().month(toExp[0]).format('MMM')+' - '+ toExp[1];
				return fromExp + ' to ' + toExp;

			})(aRow['fromExp'],aRow['toExp'])
			var locationExperience = (function(exp, location){
				exp = exp.split('-');
				exp = exp[1] +'y '+ exp[0] + 'm'
				return location+', ' +exp;
			})(aRow['exp'], aRow['current_location'])
			card.find('.profile .name').text(aRow['name']);
			card.find('.profile .designationOrganization').text(designationOrganization);
			card.find('.profile .locationExperience').text(locationExperience);
			card.find('.profile-detail .profession .designationOrganization').text(designationOrganization)
			card.find('.profile-detail .profession .designationExperience').text(designationExperience);
			card.find('.profile-detail .education .institute').text(aRow['institute']);
			card.find('.profile-detail .education .batch').text(aRow['batch']);
			card.find('.profile-detail .education .courseType').text(aRow['courseType']);
			notificationContainer.find('.detail-card').append(card);
		});
		if( data.length>4){
			var seeMore= seeMoreSection.clone().removeClass('hidden prototype');
			seeMore.find(".seeAll a").attr('href', '/followUps')
			notificationContainer.find('.detail-card').append(seeMore);
		}

	}
	var followUpsUpdateSubscription = pubsub.subscribe("fetchedFollowups", onFetchFollowUps);

	function onFetchInterviews(topic, data){
		var isMultiple = true;
		if(data.length ==1)
			isMultiple = false
		var lastDate =data[0]['slotDate'];
		var interviewContainer = $('#interviewContainer');
		var interviewRowCard = $(".interviewRow.prototype");
		var interviewCandidateCard = $('.interviewCandidateRow.prototype');
		var card = interviewRowCard.clone().removeClass('hidden prototype');
		data.forEach(function(aRow, index){
			if(index>4)
				return
			if(lastDate != aRow['slotDate']){
				lastDate = aRow['slotDate'];
				interviewContainer.find('.detail-card').append(card);
				interviewContainer.find('.detail-card').append('')
				card = interviewRowCard.clone().removeClass('hidden prototype');
			}
			var slotDate = moment(aRow['slot_date']);
			var slotTime = moment(aRow['slotTime'], 'hhmm')
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
	}
	var fetchInterviewsSubscription = pubsub.subscribe("fetchedInterviews", onFetchInterviews);

	function init(){
		pubsub.publish("pageVisit", 1);
		fetchDashboardStats();
		fetchJobs("published");
		fetchFollowUps();
		fetchInterviews();
	}
	init()

})