var jobTagsArray = {}

function Job(){
	var settings ={};
	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}
	function init(){
			settings.jobTitle= $('#jobTitle'),
			settings.jobTags= $("#jobTags"),
			settings.jobDescription = $("#jobDescription"),
			settings.postedBy= $("#postedBy"),
			settings.maxExp= $("#postedByInfo"),
			settings.description= $("#jobCategory"),
			settings.videoUrl= $("#jobCode"),
			settings.industry= $("#jobLocation"),
			settings.category= $("#jobPostedOn"),
			settings.functionalArea= $("#jobViews"),
			settings.minSal= $("#jobApplications")

			// settings.editor = new MediumEditor("#job_description", {
			// 	toolbar: false,
			// 	placeholder: {
			//         text: 'Describe the role, talk about the role and responsibilities and help potential applicants understand what makes this a great opportunity.'
			//     },
			// 	disableExtraSpaces: true,
			// 	hideOnClick: false
			// })
            //
			// settings.editor.subscribe('editableInput', function(event, editorElement){
            //
			// })

	}


	function setJobData(data) {
        debugger
		settings.title.val(getTitleFormat(obj["title"],(/\(\d+-\d+ \w+\)$/)));
		if(settings.editor){
			settings.editor.setContent(obj["description"])
		}
		settings.description.val(obj["description"]);
		settings.initialPremium = obj["premium"]
		settings.isPremium.prop("checked", obj["premium"]);
		settings.category.val(obj["category"]);
		settings.functionalArea.val(obj["functionalArea"]);


		setPillValuesByObject(settings.location.attr('id'), obj["location"], cityList);
		setPillValues(settings.location.attr('id'), obj["otherLocation"]);
		setPillValues(settings.industry.attr('id'), obj["industry"], industryTagsData);
		if(obj["videoUrl"] != "")
			settings.videoUrl.val(obj["videoUrl"]);
		if(obj["courseType"].length)
			setMultipleCheckboxes(settings.courseType.attr('id'), obj["courseType"]);
		if(obj["preferences"].length)
			setMultipleCheckboxes(settings.preferences.attr('id'), obj["preferences"]);
		if(obj["tags"].length)
			setPillValues(settings.tags.attr('id'), obj["tags"]);
		if(obj["sal"] && obj["sal"]["min"]!= 0 && obj["sal"]["max"]!=0) {
			settings.minSal.val(obj["sal"]["min"]);
			settings.maxSal.val(obj["sal"]["max"]);
			settings.confidential.prop("checked", obj["sal"]["hide"]);
		}
		else {
			settings.minSal.val();
			settings.maxSal.val();
		}
		settings.minExp.val(obj["exp"]["min"]);
		settings.maxExp.val(obj["exp"]["max"]);
		if(obj["batch"] && obj["batch"]["min"]!= "" && obj["batch"]["max"]!="") {
			settings.batchFrom.val(obj["batch"]["min"]);
			settings.batchTo.val(obj["batch"]["max"]);
		}
		else {
			settings.batchFrom.val();
			settings.batchTo.val();
		}
		settings.submitButton.text("Update")
	}



	return {
		init: init,
		setData: setJobData
	}

}
