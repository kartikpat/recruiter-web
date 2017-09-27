windowH();

function windowH() {
	var wH = $(window).height();
	$('.main-container').css({height: wH-'50'});
}

var array = [
    {
        "id": 1,
        "name": "aaaaaa"
    },
    {
        "id": 2,
        "name": "aaaaaa"
    },{
        "id": 3,
        "name": "aaaaaa"
    },{
        "id": 4,
        "name": "aaaaaa"
    },{
        "id": 5,
        "name": "aaaaaa"
    },{
        "id": 6,
        "name": "aaaaaa"
    },{
        "id": 7,
        "name": "aaaaaa"
    }
];

var showFilteredCandidatesBasedOnTags = function() {
    var tagId = $(this).attr("data-id");
    window.location = "/recruiter/filter-candidate?tagID="+tagId;
    console.log("hi")
}

$(document).ready(function(){

    getTags(array);

});

$(".show-tags-container").on('click','.js-show-tags',showFilteredCandidatesBasedOnTags)

var getTags = function(arr) {
    arr.forEach(function(aTag){
        var clonedTag = $(".js-show-tags.prototype").clone().removeClass('prototype hidden');
        clonedTag.attr("data-id",aTag["id"]);
        clonedTag.text(aTag["name"]);
        $(".show-tags-container").append(clonedTag);
    })
}
