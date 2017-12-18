jQuery(".header .menu-list-item.my-jobs").addClass("active");

jQuery(document).ready( function() {
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/", {}, function(response) {
		if(response["status"] == "success") {
			console.log(response["data"]);
			
			response["data"].forEach(function(aJob){
				var card = jQuery(".table-row.prototype.hidden").clone().removeClass('prototype hidden');
				var status = "";
				var rejMssg;
				if(aJob["rej_msg"]){
					rejMssg = aJob["rej_msg"];
				}
				else {
					rejMssg = "Nothing to show";
				}
				card.find(".job-created-on").text(ISODateToD_M_Y(aJob["created"]));
				card.find(".job-title").text(aJob["title"]);
				card.find(".status").append(aJob["status"]+"<i data-attribute="+aJob["timestamp"]+" class='rejected-message icon-information' aria-hidden='true'><span class='tooltip-message'>"+rejMssg+"</span></i>");
				// card.find(".modal").attr("data-attribute",aJob["timestamp"]);
				// card.find(".modal .modal-header .close").attr("data-attribute",aJob["timestamp"]);
				// card.find(".modal .modal-footer .close-modal").attr("data-attribute",aJob["timestamp"]);
				// card.find(".modal .modal-content .modal-center .list").text(rejMssg);
				card.find(".job-location").append("<span>"+aJob["loc"]+"</span><!--<span class='edit-job-container'><img src='https://static.iimjobs.com/recruiter/resources/images/edit-grey.png'></span>-->");
				card.find(".engagement").html(( aJob["views"]) ? '<span class="view-count">'+aJob["views"]+" views" +'</span>'+ (aJob["applied"] ? '<span class="applied-link"><a class="link-color" href="/job/'+aJob["id"]+'/candidates?title='+aJob["title"]+'">'+aJob["applied"]+'applied</a></span>'+  "" : '<span class=applied-link">0 applied</span>' ) : "" )
				$('.my-jobs-listing .table-container').append(card);
			});
		}
	});
});