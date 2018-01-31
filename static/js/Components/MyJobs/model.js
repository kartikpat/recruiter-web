var errorResponses = {
	missingEmail: 'Please enter your Email address',
	invalidEmail: 'Please enter a valid Email address',
	missingPassword: 'Please enter your password',
	invalidPassword: 'Please enter a valid password',
	userFail: 'Email address does not exist',
	passwordFail: 'Incorrect password',
	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.'
}

obj = {
    "id": 570525,
    "publishedId": 0,
    "status": "pending",
    "uid": 45058,
    "loc": ["Delhi", "Dubai"],
	"exp": {
		"min": 15,
		"max": 16
	},
	"sal": {
		"min": 15,
		"max": 16
	},
    "title": "Testing for job description (15-16 yrs)",
    "catid": 14,
    "created": "2018-01-17T10:29:12.000Z",
    "rej": 0,
    "rej_msg": "",
    "l_updated": 0,
    "premium": 0,
    "timestamp": 1516184952,
    "cnfi": 0,
    "views": null
}

function Jobs(){
	var list = {
		rowContainer: $('.jobRowList')
	};

	function createElement(){
		var card = $('.table-row.job.prototype').clone().removeClass('prototype hidden')
		return{
			element: card,
			createdOn: card.find('.createdOn'),
			title: card.find('.jobTitle'),
			location: card.find('.jobLocation'),
			experience: card.find('.jobExperience'),
			status: card.find('.jobStatus'),
			views: card.find('.jobViews'),
			applications: card.find('.jobApplications'),
			actions: card.find('.jobActions'),
			edit: card.find('.jobEdit')
		}
	}

	function init(data){
		addToList(data);
	}

	function addToList(dataArray){
		var str = '';
		dataArray.forEach(function(anItem){
			var item = createElement();
			item.element.attr('id', 'job-'+anItem['id']);
			console.log(getParameterFromTimestamp(anItem['created'], "y"))
			console.log(getParameterFromTimestamp('',"y"))
			if((getParameterFromTimestamp(anItem['created'], "y")) == getParameterFromTimestamp('',"y")) {
				item.createdOn.text(moment(anItem['created']).format('MMM DD'));
			}
			else {
				item.createdOn.text(moment(anItem['created']).format('ll'));
			}

			item.title.text(anItem['title'].replace(/\(\d+-\d+ \w+\)$/, ''));

			item.location.append("<span>"+anItem["loc"]+"</span>");
			item.experience.text(anItem["exp"]['min']+'-'+anItem['exp']['max']+' yrs')

			var message="Nothing to show";;
			if(anItem["rej_msg"]){
				message = anItem["rej_msg"];
			}
			var status = anItem['status'];
			if(status =='pending'){
				status = 'Under Review'
				message = 'We are reviewing this job. This usually takes upto 24 hours.'
			}
			console.log(anItem["status"])
			var editIcon = item.edit.find(".icon-edit");
			switch (anItem["status"]) {
				case "published":

					if(anItem["editable"]) {
						editIcon.attr("title","Edit Job");
						item.edit.find(".job-edit").attr("href", "/post-job?jobId="+anItem['id']+"")
					}
					else {
						editIcon.attr("title","This job cannot be edited now. Reach us at <a href='hello@iimjobs.com'>hello@iimjobs.com</a> in case of any issue.");
						item.edit.find(".job-edit").click(function () {
							return false;
						});
						item.edit.addClass("disable");
					}

					item.edit.removeClass("hidden");
					if(anItem["premium"]) {
						item.actions.find(".jobPremium").addClass("hidden");
					}
					console.log("111")
					item.actions.removeClass("hidden");
					break;
				case "unpublished":
				case "rejected":
				case "pending":
					editIcon.attr("title","Edit Job");
					item.edit.find(".job-edit").attr("href", "/post-job?jobId="+anItem['id']+"")
					item.edit.removeClass("hidden");
					break;
			}

			item.status.append(status+"<i data-attribute="+anItem["timestamp"]+" class='rejected-message icon-information tooltip' aria-hidden='true' title='"+message+"'></i>");
			if(anItem['views']){
				item.views.text(anItem['views']+' Views');
				item.applications.html('<a class="link-color" href="/job/'+anItem["id"]+'/candidates?title='+anItem["title"]+'">'+anItem["totalApplications"]+' Applied</a>');
			}
			else{
				item.element.find(".engagement").addClass("hidden-mobile").html('<span class="engagement-default">--</span>');
				// item.element.find(".actions .job-actions-container").addClass("hidden");
				item.element.find(".actions .job-edit-container").removeClass("hidden");
			}
			str+=item.element[0].outerHTML;
		});
		list.rowContainer.append(str);
	}

	return {
		init: init,
		add: addToList
	}
}
