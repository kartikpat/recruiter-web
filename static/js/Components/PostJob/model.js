var errorResponses = {
	missingTitle: 'title cannot be blank',
	missingLocation: 'location cannot be blank',
	missingMinExp: 'minimum experience cannot be blank',
	missingMaxExp: 'maximum experience cannot be blank',
	missingDescription: 'job description cannot be blank',
	invalidVideoUrl: 'youtube url cannot be blank',
	missingIndustry: 'please choose atleast one industry',
	missingCategory: 'category cannot be blank',
	missingFunctionalArea: 'functional area cannot be blank',
	invalidSal: 'minimum salary cannot be greater than maximum salary',
	invalidBatch: 'minimum batch cannot be greater than maximum batch'
}
function Job(){
	var settings ={};
	function init(){
			settings.title= $('#title'),
			settings.location= $("#locationTags"),
			settings.otherLocation = $("#locationTags"),
			settings.minExp= $("#min_experience"),
			settings.maxExp= $("#max_experience"),
			settings.description= $("#job_description"),
			settings.videoUrl= $("#videoID"),
			settings.industry= $("#industryTags"),
			settings.category= $("#category"),
			settings.functionalArea= $("#functional_area"),
			settings.minSal= $("#min_salary"),
			settings.maxSal= $("#max_salary"),
			settings.showSal= $("#salary_show"),
			settings.batchFrom= $("#graduating_start_year"),
			settings.batchTo= $("#graduating_end_year"),
			settings.tags= $("#jobTags"),
			settings.courseType= $("#courseType"),
			settings.preferences= $("#preferences"),
			settings.isPremium= $("#isPremium")
			settings.submitButton = $('.submit-form'),
			settings.cancelButton = $('.cancel-button')
	}
	function loginHandler(fn){
		settings.login.click(fn);
	}
	function validate(){
		console.log(settings)
		if(!(
				ifExists(settings.title)
				&& checkPillValues(settings.location)
				&& ifExists(settings.minExp)
				&& ifExists(settings.maxExp)
				&& ifExists(settings.description)
				&& checkVideoLink(settings.videoUrl)
				&& checkPillValues(settings.industry)
				&& ifExists(settings.category)
				&& ifExists(settings.functionalArea)
				&& ifGreater(settings.minSal , settings.maxSal)
				&& ifGreater(settings.batchFrom, settings.batchTo)
			)){
			console.log('returninig false')
			return false;
		}
		return true;
		if(Object.keys(settings).length ===0){
			console.log('Blank values')
			return false
		}
		for(var key in settings){
			if([ "title", "location", "minExp", "maxExp", "jobDescription",  "category", "functionalArea"].indexOf(key) > -1){
				if(!(settings.key && settings.key)){
					console.log("Missing mandatory field "+key);
					return
				}
			}
			if(["location", "industry"].indexOf(key) > -1){
				if(!(settings.key && settings.key)){
					console.log("Missing mandatory field "+key);
					return
				}
				if(!(settings.key.length <5)){
					console.log("Cannot have more than 5 values: "+key);
					return
				}
			}
		}
		return true;
	}
	function getJobData(){
		var ob = {
			title: settings.title.val(),
			description: settings.description.val(),
			isPremium: settings.isPremium.is("checked"),
			category: settings.category.val(),
			functionalArea: settings.functionalArea.val(),
			location: getPillValues(settings.location.attr('id')),
			industry: getPillValues(settings.industry.attr('id'))
		}
		if( getPillValues(settings.tags.attr('id')).length > 0)
			ob.tags = getPillValues(settings.tags.attr('id'));
		if(settings.videoUrl.val() && settings.videoUrl.val() !='')
			ob.videoUrl = settings.videoUrl.val()
		if( getMultipleCheckboxes(settings.courseType.attr('id')).length >0)
			ob.courseType = getMultipleCheckboxes(settings.courseType.attr('id'))
		if( getMultipleCheckboxes(settings.preferences.attr('id')).length >0)
			ob.preferences = getMultipleCheckboxes(settings.preferences.attr('id'))
		if( getPillValues(settings.otherLocation && settings.otherLocation.attr('id')).length >0)
			ob.otherLocation = getPillValues(settings.otherLocation.attr('id'))
		if(settings.minSal.val() && settings.maxSal.val())
			ob.sal = {
				min: settings.minSal.val(),
				max: settings.maxSal.val(),
				isShow: settings.showSal.is('checked') || false
			}
		if(settings.minExp.val() && settings.maxExp.val())
			ob.exp = {
				min: settings.minExp.val(),
				max: settings.maxExp.val()
			}
		if(settings.batchFrom.val() && settings.batchTo.val() )
			ob.batch = {
				min: settings.batchFrom.val(),
				max: settings.batchTo.val()
			}
		console.log(ob)
		return ob;
	}

	function submitHandler(fn){
		$(settings.submitButton).click(fn)
	}

	return {
		init: init,
		validate: validate,
		getData: getJobData,
		submitHandler: submitHandler
	}
}

function ifExists(element){
	console.log(element)
	if(!( element && element.val() )){
		element.next('.error').text(errorResponses['missing'+element.attr('name')]);
		return false;
	}
	return true;
}

function checkPillValues(element){
	console.log(element.attr('id'))
	console.log(getPillValues(element.attr('id')).length)
	if( getPillValues(element.attr('id')).length <1 ){
		element.next('.error').text(errorResponses['missing'+element.attr('name')]);
		return false;
	}
	return true;
}

function checkVideoLink(element){
	if(!( element && element.val() && isYouTubeLink(element.val()))){
		element.next('.error').text(errorResponses['invalid'+element.attr('name')]);
		return false;
	}
	return true;
}

function isYouTubeLink(link){
	if(!(  link && link.indexOf('https://www.youtube.com/watch?v=') >-1  )){
		return false;
	}
	return true;
}

/**
 * retrieve multiple values from the pill widget
 * @return {[type]} [description]
 */
function getPillValues(elementId){
	var el = $('#'+elementId + ' .input-tag');
	var temp = [];
	el.each(function(index, value){
		temp.push($(value).attr('data-id'))
	})
	return temp;
}

function eraseErrors(){
	settings.errors.text('');
}

function ifGreater(elementA, elementB){
	if(!(elementB.val()>=  elementA.val() )){
		console.log('returning false')
		return false;
	}
	return true;
}

/**
 * retrieve multiple checboxes
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function getMultipleCheckboxes(elementId){
	var el = $('#'+elementId+ ' .field .course-option input:checked');
	var temp =[];
	el.each(function(index, el) {
		temp.push($(el).attr('data-id'))
	});
	return temp;
}