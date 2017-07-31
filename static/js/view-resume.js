var profileContainer = $(".profile_container");
$(document).ready(function(){
	var recruiterID = localStorage.id ;
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobID, {
		userID: userID
	}, storeProfile)
	$('#slider').click(function() {
	  $('.more_info').slideToggle();
	  
	});


})
var storeProfile = function(res){
	console.log(res)
	if(res.status=="success"){
		if(res["data"]["data"].length>0){
			var data = res["data"]["data"][0];
			profileContainer.find(".userDetail .name").text(data["name"]);
			profileContainer.find(".userDetail .experience").text("Experience: "+data["exp_y"]+"y "+data["exp_m"]+"m");
			profileContainer.find(".userDetail .location").text(data["current_location"]);
			profileContainer.find(".userDetail .notice").text(data["notice"]+ " months");
			profileContainer.find(".user_img").text(data["imgUrl"]);
			profileContainer.find(".userDetail .sex").text(data["sex"]);
			profileContainer.find(".userDetail .age").text(data["dob"]);
			profileContainer.find(".userDetail .applyDate").text(data["apply_date"]);
			profileContainer.find(".userDetail .applyDate").text(data["apply_date"]);

			profileContainer.find(".extraInfo .prefLocation").text(data["pref_location"]);			
			profileContainer.find(".extraInfo .currentCTC").text(data["current_ctc"]);
			profileContainer.find(".extraInfo .expectedCTC").text(data["expected_ctc"]);

			profileContainer.find(".moreInfo .maritalStatus").text(data["marital_status"]);
			profileContainer.find(".moreInfo .languages").text(formatLanguages(data["language_known"]));
			profileContainer.find(".moreInfo .permit").text(data["work_permit"]);
			profileContainer.find(".moreInfo .handleTeam").text(data["handle_team"]);
			profileContainer.find(".moreInfo .sixDayWorking").text(data[""]);
			profileContainer.find(".moreInfo .relocate").text(data["relocate"]);
			profileContainer.find(".moreInfo .differentlyAbled").text(data["differently_abled"]);
			profileContainer.find(".moreInfo .earlyStartup").text(data["early_startup"]);
			profileContainer.find(".moreInfo .travel").text(data["willing_travel"]);
			profileContainer.find(".moreInfo .about").text(data["about"]);

			data["jobs"].forEach(function(aJob, index){
				if(index>2){
					return
				}
				var card = $(".jobCard.prototype").clone().removeClass('prototype hidden');
				card.find(".name").text(aJob["organization"])
				card.find(".designation").text(aJob["designation"]);
				card.find(".exp").text(aJob["from_exp_month"]+"/"+aJob["from_exp_year"]+" - "+aJob["to_exp_month"]+"/"+aJob["to_exp_year"]);
				profileContainer.find(".profile_content .organization").append(card);
			})

		}
	}
}

function formatLanguages(data){
	var ob = JSON.parse(data);
	var langArray = [];
	for(var key in ob){
		langArray.push(ob[key]["language_text"]);
	}
	return langArray.join(", ");
}