windowH();

function windowH() {
	var wH = $(window).height();
	$('.main-container').css({height: wH-'50'});
}

var showFilteredCandidatesBasedOnTags = function() {
    var tagId = $(this).attr("data-id");
	var tagName = $(this).attr("data-tag-name");
    window.location = "/recruiter/filter-candidate?tagID="+tagId+"&tagName="+tagName;
    console.log("hi")
}

$(document).ready(function(){

    getRequest(baseUrl+"/recruiter/"+recruiterID+"/tag/", {}, getTags)

});

$(".show-tags-container").on('click','.js-show-tags',showFilteredCandidatesBasedOnTags)

var getTags = function(res) {
	console.log(res)
	if(res["status"] == "success") {
	    res["data"].forEach(function(aTag){
	        var clonedTag = $(".js-show-tags.prototype").clone().removeClass('prototype hidden');
	        clonedTag.attr("data-id",aTag["id"]);
			clonedTag.attr("data-tag-name",aTag["name"]);
	        clonedTag.text(aTag["name"]);
	        $(".show-tags-container").append(clonedTag);
	    })
	}
}
