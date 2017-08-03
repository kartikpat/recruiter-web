var postJobForm = $(".post_job_form");
var baseUrl = "http://13.126.92.102:8000"
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



$(document).ready(function(){

	openGuidelines.click(openModal);
	closeModalBtn.click(closeModal);


});

function openMenu() {
    var x = document.getElementById("menu");
    if (x.className === "menu") {
        x.className += " responsive";
    } else {
        x.className = "menu";
    }
}

function addNewKeyword() {

  $("#keywords").append("<div class='label'>\
    <label for='keyword"+($("#keywords .label").length+1)+"'>Keyword #"+($("#keywords .label").length+1)+"</label>\
    </div>\
    <div class='field'>\
    <input type='text' id='keyword"+($("#keywords .label").length+1)+"' name='keyword"+($("#keywords .label").length+1)+"'>\
    </div>"
  );

}

function setDefaultVal(value){
   return (value === undefined) ? 0 : 1;
}

function submitForm() {
    var object = {}
	var industry = [];
	var courseType = [];
	var tags = [];
	var title = postJobForm.find("#title").val();
    if(!title) {
        postJobForm.find("#title_label").css("display","block");
    }
	var location = postJobForm.find("#location").val();
	var category = postJobForm.find("#category").val();

    postJobForm.find('#industry :selected').each(function() {
            industry.push(postJobForm.find(this).val());
	});
    if(industry.length == 0) {
        postJobForm.find("#industry_label").css("display","block");
    }
	var functionalArea = postJobForm.find("#functional_area").val();
    var minSalary = postJobForm.find("#min_salary").val();
	var maxSalary = postJobForm.find("#max_salary").val();
	var salaryShow = setDefaultVal(postJobForm.find("#salary_show:checked").val()); //$("#salary_show:checked").val() || 0,
	var minYearsOfExperience = postJobForm.find("#min_experience").val();
	var maxYearsOfExperience = postJobForm.find("#max_experience").val();

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

	postJobForm.find("#keywords .field input").each(function() {
		    tags.push(postJobForm.find(this).val());
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
	}).then(
        function(returnedData) {
            console.log("Good: ", returnedData);
        }
    ).catch(
        function(errorThrown) {
            console.log("Exception: ", errorThrown);
        }
    );

}
/*var successCallback = function(res){
    console.log(res);
}*/
