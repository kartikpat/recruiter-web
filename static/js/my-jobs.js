jQuery(document).ready( function() {
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/", {}, function(response) {
		if(response["status"] == "success") {
			console.log(response["data"]);
			
			response["data"].forEach(function(aJob){
				var card = jQuery("tr.prototype.hidden").clone().removeClass('prototype hidden');
				var status = "";
				var rejMssg;
				if(aJob["rej_msg"]){
					rejMssg = aJob["rej_msg"];
				}
				else {
					rejMssg = "Nothing to show";
				}
				card.find(".created-on").text(ISODateToD_M_Y(aJob["created"]));
				card.find(".job-title").text(aJob["title"]);
				card.find(".status").append(aJob["status"]+"<i data-attribute="+aJob["timestamp"]+" class='rejected-message fa fa-question' aria-hidden='true'><span class='tooltip-message'>"+rejMssg+"</span></i>");
				card.find(".modal").attr("data-attribute",aJob["timestamp"]);
				card.find(".modal .modal-header .close").attr("data-attribute",aJob["timestamp"]);
				card.find(".modal .modal-footer .close-modal").attr("data-attribute",aJob["timestamp"]);
				card.find(".modal .modal-content .modal-center .list").text(rejMssg);
				card.find(".action").append("<span>"+aJob["loc"]+"</span><span class='edit-job-container'><img src='https://static.iimjobs.com/recruiter/resources/images/edit-grey.png'></span>");
				card.find(".engagement").html(( aJob["views"]) ? aJob["views"]+" views "+( (aJob["applied"]) ? '<span class="applied-link"><a class="link-color" href="/job/'+aJob["id"]+'/candidates?title='+aJob["title"]+'">'+aJob["applied"]+'applied</a></span>'+  "" : "0)" ) : "" )
				$('.my-jobs-listing table').append(card);
			});
		}
	});
});