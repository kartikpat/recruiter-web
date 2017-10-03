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
        profile.find("#email").val(data["email"]).attr("readonly","readonly").css("background","#ddd").css("cursor","not-allowed");
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
	if(elem.attr("id") == "name" || elem.attr("id") == "phone") {
		if(elem.next().hasClass("hidden"))
			elem.parent().prev().removeClass("no-effect");
		else
			elem.parent().prev().addClass("no-effect");
	}
}

var checkEmpty = function(ele) {
    var elem = $(ele);
    if(elem.val() == '') {
		return false
	}
	else {
		return true
	}
}



var submitProfile = function() {
	obj = {}
	profile.find("input").each(function(index,anInput){
		if($(anInput).attr("type") == "radio" ) {
			obj[$(anInput).attr("name")] = $('input[name=settings]:checked').val();
		}
		else if($(anInput).attr("type")== "file"){
			obj[$(anInput).attr("name")] = $(anInput)[0].files[0];
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
	var form = new FormData();
	if($("#company-logo")[0].files[0] != undefined) {
		form.append("logo", $("#company-logo")[0].files[0], $("#company-logo")[0].files[0].name);
	}
	form.append("name", obj["name"]);
	if($("#profile-photo")[0].files[0] != undefined) {
		form.append("image", $("#profile-photo")[0].files[0], $("#profile-photo")[0].files[0].name);
	}
	form.append("phone", obj["phone"]);
	form.append("about", obj["about"]);
	form.append("wURL", obj["company-url"]);
	form.append("fURL", obj["social-fb"]);
	form.append("tURL", obj["social-tw"]);
	form.append("lURL", obj["social-lin"]);
	form.append("notify", obj["settings"]);
	form.append("type", obj["type"]);
	form.append("location", obj["location"]);
	console.log(form)
	checkErrorClass(profile.find("#name"));
	checkErrorClass(profile.find("#phone"));
	if(checkEmpty(profile.find("#name")) && checkEmpty(profile.find("#phone"))) {
		postRequest("http://192.168.86.199:8000/recruiter/"+recruiterID,null, form
 		, postSuccessCallback, null , null , null ,false, true, null);
	}
}

var postSuccessCallback = function(res) {
	if(res.status == "success") {
		window.location = "/";
	}
}
