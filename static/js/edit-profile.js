var profile = $(".edit-profile-form");

$(document).ready(function() {
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateProfile);
	profile.find("#save-form-button").click(submitProfile);
	profile.find("#name").on('input',function() {
		checkErrorClass(this);
	});
	profile.find("#phone").on('input',function() {
		checkErrorClass(this);
	});
	profile.find("#about").on('keyup',function() {
		$(this).next().text(500 - $(this).val().length+" characters remaining").removeClass("hidden");
	});
});

var populateProfile = function(res) {
    console.log(res);
	if(res.status =="success") {
		var data = res["data"][0];
		profile.find("#name").val(data["name"]);
		profile.find("#about").val(data["about"]);
		profile.find("#about").next().text(500 - profile.find("#about").val().length+" characters remaining").removeClass("hidden");
        profile.find("#phone").val(data["phone"]);
        profile.find("#email").val(data["email"]).attr("readonly","readonly").css("background","#ddd");
        profile.find("#organisation").val(data["org"]);
		profile.find("#company-url").val(data["wurl"]);
        profile.find("#designation").val(data["desg"]);
		if(data["lurl"]) {
            profile.find("#social-lin").val(data["lurl"]);
		}
		if(data["furl"]) {
            profile.find("#social-fb").val(data["furl"]);
		}
		if(data["turl"]) {
            profile.find("#social-tw").val(data["turl"]);
		}
	}
}

var checkErrorClass = function(ele) {
    var elem = $(ele);
    elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
}



var submitProfile = function() {
	obj = {}
	profile.find("input").each(function(index,anInput){
		if($(anInput).attr("type") == "radio" ) {
			obj[$(anInput).attr("name")] = $('input[name=settings]:checked').val();
		}
		else {
			obj[$(anInput).attr("name")] = $(anInput).val();
		}
	})
	profile.find("select").each(function(index,anInput){
			obj[$(anInput).attr("name")] = $(anInput).val();
	})
	profile.find("textarea").each(function(index,anInput){
			obj[$(anInput).attr("name")] = $(anInput).val();
	})
	checkErrorClass(profile.find("#name"));
	checkErrorClass(profile.find("#phone"));
	console.log(obj);
}
