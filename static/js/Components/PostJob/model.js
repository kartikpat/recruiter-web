function Job(){
	var settings ={};
	var submitButton = $('.submit-form');
	function validate(){
		for(var key in this.settings){
			if([ "title", "location", "minExp", "maxExp", "jobDescription",  "category", "functionalArea"].indexOf(key) > -1){
				if(!(jobDetails.key && jobDetails.key)){
					console.log("Missing mandatory field "+key);
				}
			}
			if(["location", "industry"].indexOf(key) > -1){
				if(!(jobDetails.key && jobDetails.key)){
					console.log("Missing mandatory field "+key);
				}
				if(!(jobDetails.key.length <5)){
					console.log("Cannot have more than 5 values: "+key);
				}
			}
		}
		return true;
	}
	function getJobData(){
		var ob = {
			title: settings.title,
			description: settings.description,
			isPremium: settings.isPremium,
			category: settings.category,
			functionalArea: settings.functionalArea,
			location: settings.location,
			industry: settings.industry
		}
		if(settings.tags && settings.tags.length >0)
			ob.tags = settings.tags;
		if(settings.videoUrl && settings.videoUrl !='')
			ob.videoUrl = settings.videoUrl
		if(settings.courseType && settings.courseType.length >0)
			ob.courseType = settings.courseType
		if(settings.preferences && settings.preferences.length >0)
			ob.preferences = settings.preferences
		if(settings.otherLocation && settings.otherLocation.length >0)
			ob.otherLocation = settings.otherLocation
		if(settings.minSal && settings.maxSal)
			ob.sal = {
				min: settings.minSal,
				max: settings.maxSal,
				isShow: settings.isShow || null
			}
		if(settings.minExp && settings.maxExp)
			ob.exp = {
				min: settings.minExp,
				max: settings.maxExp
			}
		if(settings.batchFrom && settings.batchTo)
			ob.batch = {
				min: settings.batchFrom,
				max: settings.batchTo
			}
		return ob;
	}

	function submitHandler(fn){
		$(this.submitButton).click(fn)
	}

	return {
		init: function(fn){
			if(fn)
				this.submitHandler(fn);
			this.settings = {
			 	title: $('#title').val(),
				location: getPillValues("#locationTags"),
				minExp: $("#min_experience").val(),
				maxExp: $("#max_experience").val(),
				description: $("#job_description").val(),
				videoUrl: $("#videoID").val(),
				industry: getPillValues("#industryTags"),
				category: $("#category").val(),
				functionalArea: $("#functional_area").val(),
				minSal: $("#min_salary").val(),
				maxSal: $("#max_salary").val(),
				showSal: $("#salary_show").is("checked"),
				batchFrom: $("#graduating_start_year").val(),
				batchTo: $("#graduating_end_year").val(),
				tags: getPillValues("#tags"),
				courseType: getMultipleCheckboxes("#courseType"),
				preferences: getMultipleCheckboxes("#preferences"),
				isPremium: $("#isPremium").is("checked")
			}
		},
		validate: validate,
		getData: getJobData,
		submitHandler: submitHandler
	}
}

function submitButton(){
	return $(".submit-form");
}
function cancelButton(){
	return $(".cancel-form");
}

/**
 * retrieve multiple values from the pill widget
 * @return {[type]} [description]
 */
function getPillValues(elementId){
	var el = $(elementID + ' .input-tag');
	var temp = [];
	el.each(function(index, value){
		temp.push($(value).attr('data-id'))
	})
	return temp;
}

/**
 * retrieve multiple checboxes
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function getMultipleCheckboxes(elementId){
	var el = $(elementId+ ' .field .course-option input:checked');
	var temp =[];
	el.each(function(index, el) {
		temp.push($(el).attr('data-id'))
	});
	return temp;
}