var postJobForm = $(".post_job_form");
var tagsContainer = $(".tags-container");
var baseUrl = "http://13.126.92.102:8000"
var baseUrlTags = "http://13.126.180.75:5000"
var recruiterID = localStorage.id;

var modal = $('.modal');
var openGuidelines = $("#posting-guidelines");
var closeModalBtn = $(".close");

var openModal = function() {
    modal.removeClass('hidden');
}

var closeModal = function() {
    modal.addClass('hidden');
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.addClass('hidden');
    }
}

var requestTags = function() {
     var title = postJobForm.find("#title").val();
     console.log(title);
     var jobDescription = postJobForm.find("#job_description").val();
     var category = postJobForm.find("#category").val();

    if(title && jobDescription && category) {
        postRequest(baseUrlTags+"/result",  { "content-type": "application/json"}, JSON.stringify({
            "TITLE": title,
            "JD": jobDescription,
            "CATEGORY": category
        }), showSuggestedTags, null)
    }
}

var showSuggestedTags = function(res) {
    tagsContainer.find('.suggested-tags-content').empty();
	$.each(res["tags"], function(arrayKey, anElement) {
		var filterTag = $('.js-show-suggested-tags.prototype').clone().removeClass('prototype hidden');
		filterTag.text(anElement);
        filterTag.attr("data-value", anElement);
		filterTag.addClass('inline-block box_shadow  font-sm');
	    tagsContainer.find('.suggested-tags-content').append(filterTag);
	})
    tagsContainer.find(".suggested-tags-container").removeClass("hidden");
}

var selectedTagsContainer = tagsContainer.find('.selected-tags-container');
var suggestedTagsContainer = tagsContainer.find('.suggested-tags-container');
tagsContainer.on('click', '.js-show-suggested-tags', function() {
    var value = $(this).attr("data-value");
    if(!($(this).hasClass("highlight"))) {
        tagsContainer.find('.suggested-tags-content .js-show-suggested-tags[data-value="'+value+'"]').addClass("highlight");
        var filterTag = $('.js-show-selected-tags.prototype').clone().removeClass('prototype hidden');
        filterTag.text(value);
        filterTag.addClass('inline-block box_shadow font-sm');
        filterTag.attr("data-value", value);
        tagsContainer.find('.selected-tags-content').append(filterTag);
        if(selectedTagsContainer.hasClass("hidden")) {
            selectedTagsContainer.removeClass("hidden");
        }
    }
    else {
        tagsContainer.find('.suggested-tags-content .js-show-suggested-tags[data-value="'+value+'"]').removeClass("highlight");
        tagsContainer.find('.selected-tags-content .js-show-selected-tags[data-value="'+value+'"]').remove();
        if(tagsContainer.find('.selected-tags-content').children().length == 0) {
            selectedTagsContainer.addClass("hidden");
        }
    }
})

tagsContainer.on('click', '.js-show-selected-tags', function() {
    var value = $(this).attr("data-value");
    $(this).remove();
    tagsContainer.find('.suggested-tags-content .js-show-suggested-tags[data-value="'+value+'"]').removeClass("highlight");
    if(tagsContainer.find('.selected-tags-content').children().length == 0) {
        selectedTagsContainer.addClass("hidden");
    }
})

tagsContainer.find('.add-new-tag').on('click', function(){
    var inputValue = tagsContainer.find(".tag-input").val();
    if(inputValue) {
        var filterTag = $('.js-show-selected-tags.prototype').clone().removeClass('prototype hidden');
        filterTag.text(inputValue);
        filterTag.addClass('inline-block box_shadow font-sm');
        tagsContainer.find('.selected-tags-content').append(filterTag);
    }

    if(selectedTagsContainer.hasClass("hidden")) {
        selectedTagsContainer.removeClass("hidden");
    }
})

$(document).ready(function(){
	openGuidelines.click(openModal);
	closeModalBtn.click(closeModal);
    $(".close-modal").click(closeModal);
    $(".submit-form").click(submitForm);
    $(".cancel-form").click(cancelForm);
    postJobForm.find("#title").focusout(requestTags);
    postJobForm.find("#job_description").focusout(requestTags);
    postJobForm.find("#category").focusout(requestTags);
    postJobForm.find("#title").on('input',function() {
        var elem = $(this);
        elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
    });
    postJobForm.find("#industry").on('input',function() {
        var elem = $(this);
        elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
    });
    postJobForm.find("#functional_area").on('input',function() {
        var elem = $(this);
        elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
    });
    postJobForm.find("#min_experience").on('input',function() {
        var elem = $(this);
        elem.val() === '' ? postJobForm.find("#min-experience-label").removeClass("hidden"): postJobForm.find("#min-experience-label").addClass("hidden");
    });
    postJobForm.find(" #max_experience").on('input',function() {
        var elem = $(this);
        elem.val() === '' ? postJobForm.find("#max-experience-label").removeClass("hidden"): postJobForm.find("#max-experience-label").addClass("hidden");
    });
});

var cancelForm = function() {
    window.location = "/";
}

function openMenu() {
    var x = document.getElementById("menu");
    if (x.className === "menu") {
        x.className += " responsive";
    } else {
        x.className = "menu";
    }
}

function setDefaultVal(value){
   return (value === undefined) ? 0 : 1;
}

var submitForm = function() {
    //console.log("hi");
	var industry = [];
	var courseType = [];
	var tags = [];
	var title = postJobForm.find("#title").val();
    if(!title) {
        postJobForm.find("#title_label").removeClass("hidden");
    }
	var location = postJobForm.find("#location").val();
	var category = postJobForm.find("#category").val();

    postJobForm.find('#industry :selected').each(function() {
            industry.push(postJobForm.find(this).val());
	});
    if(industry.length == 0) {
        postJobForm.find("#industry_label").removeClass("hidden");
    }
	var functionalArea = postJobForm.find("#functional_area").val();
    if(!functionalArea) {
        postJobForm.find("#functional_area-label").removeClass("hidden");
    }
    var minSalary = postJobForm.find("#min_salary").val();
	var maxSalary = postJobForm.find("#max_salary").val();

	var salaryShow = setDefaultVal(postJobForm.find("#salary_show:checked").val()); //$("#salary_show:checked").val() || 0,
	var minYearsOfExperience = postJobForm.find("#min_experience").val();
	var maxYearsOfExperience = postJobForm.find("#max_experience").val();
    if(!minYearsOfExperience ) {
        postJobForm.find("#min-experience-label").removeClass("hidden");
    }
    if(!maxYearsOfExperience ) {
        postJobForm.find("#max-experience-label").removeClass("hidden");
    }

	postJobForm.find("input[name='course_type[]']:checked").each(function() {
		    courseType.push(postJobForm.find(this).val());
			});

	var graduatingStartYear = postJobForm.find("#graduating_start_year").val();
	var graduatingEndYear = postJobForm.find("#graduating_end_year").val();
	var isPremium = setDefaultVal(postJobForm.find("#premium_job:checked").val());
	var jobDescription = postJobForm.find("#job_description").val();
	var isFemaleCandidate = setDefaultVal(postJobForm.find("#female_candidates:checked").val());
	var isDifferentlyAbled = setDefaultVal(postJobForm.find("#differently_abled:checked").val());
	var isExDefence = setDefaultVal(postJobForm.find("#ex_defence:checked").val());
	var isWorkHome = setDefaultVal(postJobForm.find("#work_home:checked").val());
	var isFemaleBackWorkforce = setDefaultVal(postJobForm.find("#female_back_workforce:checked").val());

	postJobForm.find(".selected-tags-container .field .selected-tags-content .js-show-selected-tags").each(function() {
		    tags.push($(this).text());


	});

  	postRequest(baseUrl+"/recruiter/"+recruiterID+"/job", null, {
		max: maxYearsOfExperience,
		tags: tags,
        premium_post: isPremium,
        female_candidate: isFemaleCandidate,
        differently_abled: isDifferentlyAbled,
        ex_defence: isExDefence,
        work_home: isWorkHome,
        female_back_workforce: isFemaleBackWorkforce,
        course_type: JSON.stringify(courseType),
        title: title,
        otherLocation: location,
        category: category,
        industry: JSON.stringify(industry),
        functional_area: functionalArea,
        min: minYearsOfExperience,
        minsal: minSalary,
        maxsal: maxSalary,
        uid: recruiterID,
        batch: graduatingStartYear,
        maxBatch: graduatingEndYear,
        salShow: salaryShow
	}, successCallback);
}


var successCallback = function(res){
    if(res.status === "success") {
        window.location = "/recruiter/recruiter-plan?success=1";
    }
}
