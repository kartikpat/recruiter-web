var postJobForm = $(".post_job_form");
var tagsContainer = $(".tags-container");
var baseUrlTags = "http://13.126.180.75:4000"
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
            "JD": jobDescription
        }), showSuggestedTags, null)
    }
}

var showSuggestedTags = function(res) {
    tagsContainer.find('.suggested-tags-content').empty();
	$.each(res["tags"], function(arrayKey, anElement) {
		var filterTag = $('.js-show-suggested-tags.prototype').clone().removeClass('prototype hidden');
		filterTag.html(anElement);
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
        filterTag.html(value+"<i class='fa fa-times' aria-hidden='true'></i>");
        filterTag.addClass('inline-block box_shadow font-sm');
        filterTag.attr("data-value", value);
        // tagsContainer.find('.selected-tags-content').append(filterTag);
        tagsContainer.find('.add-tags-content').prepend(filterTag);
        // if(selectedTagsContainer.hasClass("hidden")) {
        //     selectedTagsContainer.removeClass("hidden");
        // }
    }
    else {
        tagsContainer.find('.suggested-tags-content .js-show-suggested-tags[data-value="'+value+'"]').removeClass("highlight");
        tagsContainer.find('.add-tags-content .js-show-selected-tags[data-value="'+value+'"]').remove();

    }
})

tagsContainer.on('click', '.js-show-selected-tags', function() {
    var value = $(this).attr("data-value");
    $(this).remove();
    tagsContainer.find('.suggested-tags-content .js-show-suggested-tags[data-value="'+value+'"]').removeClass("highlight");
    // if(tagsContainer.find('.selected-tags-content').children().length == 0) {
    //     selectedTagsContainer.addClass("hidden");
    // }
})
//
// tagsContainer.find('.add-new-tag').on('click', function(){
//     var inputValue = tagsContainer.find(".tag-input").val();
//     if(inputValue) {
//         var filterTag = $('.js-show-selected-tags.prototype').clone().removeClass('prototype hidden');
//         filterTag.html(inputValue+"<i class='fa fa-times' aria-hidden='true'></i>");
//         filterTag.addClass('inline-block box_shadow font-sm');
//         tagsContainer.find('.selected-tags-content').append(filterTag);
//     }
//
//     if(selectedTagsContainer.hasClass("hidden")) {
//         selectedTagsContainer.removeClass("hidden");
//     }
// })

tagsContainer.find('.tag-input').keypress(function(event) {
    // event.preventDefault();
    var key = event.which;
    if(key == 13) {

        var inputValue = $(this).text();
        console.log(inputValue)
        if(inputValue) {
            var filterTag = $('.js-show-selected-tags.prototype').clone().removeClass('prototype hidden');
            filterTag.html(inputValue+"<i class='fa fa-times' aria-hidden='true'></i>");
            filterTag.addClass('inline-block box_shadow font-sm');
            // tagsContainer.find('.selected-tags-content').append(filterTag);
            tagsContainer.find('.add-tags-content').prepend(filterTag);
        }

        // if(tagsContainer.find('.selected-tags-content').hasClass("hidden")) {
        //     tagsContainer.find('.selected-tags-content').removeClass("hidden");
        // }
         $(this).text('');
        return false

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
    postJobForm.find("input[data-attribute='mandatory'],textarea[data-attribute='mandatory'], select[data-attribute='mandatory']").focusout(function() {
        checkErrorClass(this);
    });

    // postJobForm.find("#industry").on('input',function() {
    //     var elem = $(this);
    //     elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
    // });
    // postJobForm.find("#functional_area").on('input',function() {
    //     var elem = $(this);
    //     elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
    // });
    // postJobForm.find("#min_experience").on('input',function() {
    //     var elem = $(this);
    //     elem.val() === '' ? postJobForm.find("#min-experience-label").removeClass("hidden"): postJobForm.find("#min-experience-label").addClass("hidden");
    // });
    // postJobForm.find(" #max_experience").on('input',function() {
    //     var elem = $(this);
    //     elem.val() === '' ? postJobForm.find("#max-experience-label").removeClass("hidden"): postJobForm.find("#max-experience-label").addClass("hidden");
    // });

	postJobForm.find("input[data-attribute='mandatory'],textarea[data-attribute='mandatory']").focusin(function() {
        removeErrorClass(this);
    });
    postJobForm.find("#graduating_start_year,#graduating_end_year").focusin(function() {
        postJobForm.find("#graduating-year-label").addClass("hidden");
    });
    postJobForm.find("#min_salary,#max_salary").focusin(function() {
        postJobForm.find("#salary-label").addClass("hidden");
    });
    postJobForm.find("#min_experience").focusin(function(){
        postJobForm.find("#min-experience-label").addClass("hide");
        if(postJobForm.find("#max_experience").val() != '') {
            postJobForm.find(".experience-label-container").addClass("hidden");
        }
    })
    postJobForm.find("#max_experience").focusin(function(){
        postJobForm.find("#max-experience-label").addClass("hide");
        if(postJobForm.find("#min_experience").val() != '') {
            postJobForm.find(".experience-label-container").addClass("hidden");
        }
    })
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
    var isSalary = true;
    var isGraduatingYear = true;
	var title = postJobForm.find("#title").val();

	var location = postJobForm.find("#location").val();
	var category = postJobForm.find("#category").val();

    postJobForm.find('#industry :selected').each(function() {
            industry.push(postJobForm.find(this).val());
	});

	var functionalArea = postJobForm.find("#functional_area").val();

    var minSalary = postJobForm.find("#min_salary").val();
	var maxSalary = postJobForm.find("#max_salary").val();
    if(maxSalary && minSalary && maxSalary < minSalary) {
        postJobForm.find("#salary-label").text("Maximum Salary should be greater than Minimum Salary").removeClass("hidden");
        isSalary = false;
    }

	var salaryShow = setDefaultVal(postJobForm.find("#salary_show:checked").val()); //$("#salary_show:checked").val() || 0,
	var minYearsOfExperience = postJobForm.find("#min_experience").val();
	var maxYearsOfExperience = postJobForm.find("#max_experience").val();


	postJobForm.find("input[name='course_type[]']:checked").each(function() {
		    courseType.push(postJobForm.find(this).val());
			});

	var graduatingStartYear = postJobForm.find("#graduating_start_year").val();
	var graduatingEndYear = postJobForm.find("#graduating_end_year").val();
    if(graduatingStartYear && graduatingEndYear && parseInt(graduatingEndYear) < parseInt(graduatingStartYear)) {
        postJobForm.find("#graduating-year-label").text("Maximum Graduating Year should be greater than Minimum Graduating Year").removeClass("hidden");
        isGraduatingYear = false;
    }
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

    if(checkErrorClass(postJobForm.find("#title")) && checkErrorClass(postJobForm.find("#industry")) && checkErrorClass(postJobForm.find("#functional_area")) && checkErrorClass(postJobForm.find("#min_experience")) && checkErrorClass(postJobForm.find("#max_experience")) && checkErrorClass(postJobForm.find("#job_description")) && isSalary && isGraduatingYear ) {
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
}


var successCallback = function(res){
    if(res.status === "success") {
        window.location = "/recruiter/recruiter-plan?success=1";
    }
}

var checkErrorClass = function(ele) {
	var elem = $(ele);
	var value = elem.val();
	if(elem.attr("id") == "title") {
		if(value == '') {
			elem.next().text("Please provide the title").removeClass("hidden");
			return false;
		}
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
    if(elem.attr("id") == "industry") {
		if(value.length == 0) {
			elem.next().text("Please select at least one industry").removeClass("hidden");
			return false;
		}
        else if (value.length > 5) {
            elem.next().text("Please select at most five industry").removeClass("hidden");
			return false;
        }
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
	if(elem.attr("id") == "functional_area") {
		if(value == '') {
			elem.next().text("Please select the functional area").removeClass("hidden");
			return false;
		}
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
    if(elem.attr("id") == "min_experience") {
		if(value == '') {
            postJobForm.find(".experience-label-container").removeClass("hidden");
			postJobForm.find("#min-experience-label").text("Please select Min Experience").removeClass("hide")
			return false;
		}
		else {
			postJobForm.find("#min-experience-label").addClass("hide");
            var maxExp = postJobForm.find("#max_experience").val();
            if(maxExp != '') {
                if(parseInt(maxExp) < parseInt(value)) {
                    postJobForm.find("#min-experience-label").text("Max Experience Should be greater than Min Experience").removeClass("hide");
                    postJobForm.find(".experience-label-container").removeClass("hidden");
                }
                else {
                    postJobForm.find(".experience-label-container").addClass("hidden");
                }
            }
			return true;
		}
	}
    if(elem.attr("id") == "max_experience") {

		if(value == '') {
            postJobForm.find(".experience-label-container").removeClass("hidden");
			postJobForm.find("#max-experience-label").text("Please select Max Experience").removeClass("hide")
			return false;
		}
		else {
			postJobForm.find("#max-experience-label").addClass("hide");

            var minExp = postJobForm.find("#min_experience").val();
            var maxExp = postJobForm.find("#max_experience").val()
            console.log(minExp);
            console.log(maxExp);
            if(minExp != '') {


                if(parseInt(minExp) > parseInt(maxExp)) {
                    console.log("true");
                    postJobForm.find("#max-experience-label").text("Max Experience Should be greater than Min Experience").removeClass("hide");
                    postJobForm.find(".experience-label-container").removeClass("hidden");
                }
                else {
                    console.log("false");
                    postJobForm.find(".experience-label-container").addClass("hidden");
                }
            }
			return true;
		}
	}
    if(elem.attr("id") == "job_description") {
		if(value == '') {
			elem.next().text("Please provide the description").removeClass("hidden");
			return false;
		}
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
}

var removeErrorClass = function(ele) {
	var elem = $(ele);
	elem.next().addClass("hidden");
}
