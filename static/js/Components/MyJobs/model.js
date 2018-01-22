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
			applications: card.find('.jobApplications')
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
			item.createdOn.text(moment(anItem['created']).format('DD MMM YYYY'));
			item.title.text(anItem['title']);

			item.location.append("<span>"+anItem["loc"]+"</span><!--<span class='edit-job-container'><img src='https://static.iimjobs.com/recruiter/resources/images/edit-grey.png'></span>-->");
			item.experience.text(anItem['min']+'-'+anItem['max']+' yrs')

			var message="Nothing to show";;
			if(anItem["rej_msg"]){
				message = anItem["rej_msg"];
			}
			var status = anItem['status'];
			if(status =='pending'){
				status = 'Under Review'
				message = 'We are reviewing this job. This usually takes upto 24 hours.'
			}

			item.status.append(status+"<i data-attribute="+anItem["timestamp"]+" class='rejected-message icon-information tooltip' aria-hidden='true' title='"+message+"'></i>");
			if(anItem['views']){
				item.views.text(anItem['views']+' Views');
				item.applications.html('<a class="link-color" href="/job/'+anItem["id"]+'/candidates?title='+anItem["title"]+'">'+anItem["totalApplications"]+' Applied</a>');
			}
			else{
				item.element.find(".engagement").addClass("hidden-mobile").html('<span class="engagement-default">--</span>');
				item.element.find(".actions .job-actions-container").addClass("hidden");
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