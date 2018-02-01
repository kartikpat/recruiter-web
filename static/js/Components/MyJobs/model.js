function Jobs(){
	var list = {
		rowContainer: $('.jobRowList')
	};

	function cloneElement(id) {
		var card = $('.table-row.job.prototype').clone().removeClass('prototype hidden')
		card.attr('id', 'job-'+id);
		return {
			element: card,
			createdOn: card.find('.js_jobCreatedOn'),
			title: card.find('.js_jobTitle'),
			status: card.find('.js_jobStatus'),
			engagement: card.find('.js_jobEngagement'),
			actions: card.find('.js_jobActions')
		}
	}

	function setJobCreatedOn(created, item) {
		var date = (moment(created).format('YYYY') == moment().format('YYYY')) ? moment(created).format('MMM DD') : moment(created).format('ll');
		item.find(".js_createdOn").text(date);
	}

	function setJobTitle(title,item) {
		item.find('.js_title').text(title.replace(/\(\d+-\d+ \w+\)$/, ''));
	}

	function setJobLocation(loc, item) {
		var loc = loc.toString();
		if(!loc.length) {
			item.find('.js_seperator').addClass("hidden")
			return
		}
		loc.length <= 3 ? item.find('.js_location').append("<span>"+loc+"</span>") : item.find('.js_multipleLocation').attr("title",loc).removeClass("hidden");

	}

	function setJobStatus(aData, item) {
		var status = aData["status"];
		var message = 'Nothing to show';
		switch(aData["status"]) {
			case "rejected":
				if(aData["rej_msg"]){
					message = aData["rej_msg"];
				}
				break;
			case "pending":
				status = 'Under Review'
				message = 'We are reviewing this job. This usually takes upto 24 hours.'
				break;
			default:
				break;
		}
		status = status+"<i data-attribute="+aData["timestamp"]+" class='icon-information tooltip' aria-hidden='true' title='"+message+"'></i>";
		item.find(".js_status").append(status);
	}

	function createElement(aData){
		var item = cloneElement(aData["id"]);
		setJobCreatedOn(aData["created"], item.createdOn);
		setJobTitle(aData["title"], item.title);
		setJobLocation(aData["loc"], item.title);
		item.title.find('.js_experience').text(aData["exp"]['min']+'-'+aData['exp']['max']+' yrs')
		setJobStatus(aData, item.status, item)
	}

	function init(data){
		addToList(data);
	}

	function addToList(dataArray){
		var str = '';
		dataArray.forEach(function(aData){
			var item = createElement(aData);







			var editIcon = item.edit.find(".icon-edit");

			switch (status) {
				case "published":

					if(anItem["editable"]) {
						editIcon.attr("title","Edit Job");
						item.edit.find(".job-edit").attr("href", "/post-job?jobId="+anItem['id']+"")
					}
					else {
						editIcon.attr("title","This job cannot be edited now. Reach us at hello@iimjobs.com in case of any issue.");
						item.edit.find(".job-edit").click(function (event) {
							event.preventDefault()
						});
						editIcon.addClass("disable");
					}

					item.edit.removeClass("hidden");
					if(anItem["premium"]) {
						item.actions.find(".jobPremium").addClass("hidden");
						item.premium.removeClass("hidden")
					}

					item.actions.removeClass("hidden");
					break;
				case "unpublished":
				case "rejected":
				case "pending":

					item.status.append(tempStatus+"<i data-attribute="+anItem["timestamp"]+" class='rejected-message icon-information tooltip' aria-hidden='true' title='"+message+"'></i>");
					editIcon.attr("title","Edit Job");
					item.edit.find(".job-edit").attr("href", "/post-job?jobId="+anItem['id']+"")
					item.edit.removeClass("hidden");
					if(anItem["premium"]) {

						item.premium.removeClass("hidden")
					}
					break;
			}


			if(anItem['views']){
				item.views.text(anItem['views']+' Views');
				item.applications.html('<a class="link-color" href="candidate-apply-list/'+anItem["id"]+'?title='+anItem["title"]+'">'+anItem["totalApplications"]+' Applied</a>');
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
