

var errorResponses = {
	missingTitle: 'Please enter the job title',
	missingLocation: 'Please choose a location',
	missingMinExp: 'Please choose years of experience required for the job',
	missingMaxExp: 'Please choose years of experience required for the job',
	missingDescription: 'Please fill the job description',
	invalidVideoUrl: 'enter proper youtubeURL',
	missingIndustry: 'Please choose an industry from the drop-down',
	missingCategory: 'Please choose a category from the drop-down',
	missingFunctionalArea: 'Please choose a functional-area from the drop-down',
	invalidSal: 'Maximum Salary should be greater than Minimum Salary',
	invalidBatch: 'Maximum Batch should be greater than Minimum Batch',
	invalidMinExp: 'Maximum Years of Experience should be greater than Minimum Years of Experience'
}


function Job(){
	var settings ={};
	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}
	function init(type){
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
			settings.confidential= $("#salary_show"),
			settings.batchFrom= $("#graduating_start_year"),
			settings.batchTo= $("#graduating_end_year"),
			settings.tags= $("#jobTags"),
			settings.courseType= $("#courseType"),
			settings.preferences= $("#preferences"),
			settings.isPremium= $("#isPremium")
			settings.submitButton = $('.submit-form'),
			settings.cancelFormButton = $('#cancelForm'),
			settings.error = $('.error'),
			settings.creditsText = $('#creditsText');
			setAvailableCredits(settings.creditsText, config["availableCredits"]);
			onClickCancelForm(settings.cancelFormButton);

			var salaryRange = 100;
			for(var i=0; i< salaryRange; i++){
				settings.maxSal.append('<option value="'+(i+1)+'">'+(i+1)+'</option>')
				settings.minSal.append('<option value="'+(i+1)+'">'+(i+1)+'</option>')
			}

			if(type=='edit'){
				settings.editor = new MediumEditor("#job_description", {
					toolbar: false,
					placeholder: {
				        text: 'Describe the role, talk about the role and responsibilities and help potential applicants understand what makes this a great opportunity.'
				    }
				})
				settings.editor.subscribe('editableInput', function(event, editorElement){
					settings.description.val(settings.editor.getContent());
				})
			}
	}


	function onChangeJobPremium(fn) {
		settings.isPremium.change(function() {
			console.log(this.checked)
			if(this.checked) {
				if(config["availableCredits"]) {
					settings.creditsText.text("This job will be posted as premium. You will have "+(config["availableCredits"]-1)+" credits left.")
					return
				}
				$(this).prop("checked", false)
				settings.creditsText.text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
				return fn();
			}
			settings.creditsText.text("You have "+config["availableCredits"]+" credits left.")
		})

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
				&& ifGreater(settings.minExp, settings.maxExp)
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
		var locationObj = getPillValues(settings.location.attr('id'));
		var industryObj = getPillValues(settings.industry.attr('id'));

		var ob = {
			title: settings.title.val(),
			description: settings.description.val(),
			premium: settings.isPremium.is(':checked') ? 1 : 0,
			category: settings.category.val(),
			functionalArea: settings.functionalArea.val(),
			location: locationObj.id,
			otherLocation: locationObj.label,
			industry: industryObj.id
		}

		var tagsObj = getPillValues(settings.tags.attr('id'));
		if( tagsObj['label'].length > 0 )
			ob.tags = tagsObj['label'];
		if(settings.videoUrl.val() && settings.videoUrl.val() !='')
			ob.videoUrl = settings.videoUrl.val()
		if( getMultipleCheckboxes(settings.courseType.attr('id')).length >0)
			ob.courseType = getMultipleCheckboxes(settings.courseType.attr('id'))
		if( getMultipleCheckboxes(settings.preferences.attr('id')).length >0)
			ob.preferences = getMultipleCheckboxes(settings.preferences.attr('id'))

		if(settings.minSal.val() && settings.maxSal.val())
			ob.sal = {
				min: settings.minSal.val(),
				max: settings.maxSal.val(),
				cnfi: settings.confidential.is(':checked') ? 1 : 0
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

	function setJobData(jobId, obj) {
		settings.title.val(obj["title"]);
		if(settings.editor){
			settings.editor.setContent(obj["description"])
		}
		settings.description.val(obj["description"]);
		settings.isPremium.prop("checked", obj["premium"]);
		settings.category.val(obj["category"]);
		settings.functionalArea.val(obj["functionalArea"]);
		console.log(obj)

		// setPillValues(settings.location.attr('id'), loca);
		setPillValues(settings.location.attr('id'), obj["location"]);

		setPillValues(settings.industry.attr('id'), obj["industry"], industryTagsData);
		if(obj["videoUrl"])
			settings.videoUrl.val(obj["videoUrl"]);
		if(obj["courseType"])
			setMultipleCheckboxes(settings.courseType.attr('id'), obj["courseType"]);
		if(obj["preferences"])
			setMultipleCheckboxes(settings.preferences.attr('id'), obj["preferences"]);
		setPillValues(settings.tags.attr('id'), obj["tags"]);
		if(obj["sal"] && obj["sal"]["min"]!= 0 && obj["sal"]["max"]!=0) {
			settings.minSal.val(obj["sal"]["min"]);
			settings.maxSal.val(obj["sal"]["max"]);
			settings.confidential.prop("checked", obj["sal"]["cnfi"]);
		}
		settings.minExp.val(obj["exp"]["min"]);
		settings.maxExp.val(obj["exp"]["max"]);
		if(obj["batch"]) {
			settings.batchFrom.val(obj["batch"]["min"]);
			settings.batchTo.val(obj["batch"]["max"]);
		}

	}

	function submitHandler(fn){
		$(settings.submitButton).click(fn)
	}



	return {
		init: init,
		setConfig : setConfig,
		validate: validate,
		getData: getJobData,
		submitHandler: submitHandler,
		setData: setJobData,
		onChangeJobPremium: onChangeJobPremium
	}
}

function setAvailableCredits(element, credits) {
	if(!credits) {
		element.text("Reach out to more candidates in less amount of time by making your job premium.")
		return
	}
	element.text("You have "+credits+" credits left.")
}


function onClickCancelForm(element) {
	element.click(function() {
		window.location.href = "/"
	})
}

function ifExists(element){

	var errorElement = element.next('.error').length ? element.next('.error') : element.siblings('.error');
	if(!( element && element.val() )){
		errorElement.text(errorResponses['missing'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)

		return false;
	}
	else if (!errorElement.hasClass("hidden")) {
		eraseError(element)
		console.log("entering in else if")
	}
	console.log("returning true")
	return true;
}

function checkPillValues(element) {
	var obj = getPillValues(element.attr('id'))
	console.log(element.attr('data-enable-custom'));
	if(element.attr('data-enable-custom') == "true") {
		if( obj["id"].length < 1 && obj["label"].length < 1 ){
			element.next('.error').text(errorResponses['missing'+element.attr('name')]).removeClass("hidden");
			focusOnElement(element)
			return false;
		}
		else if (!element.next('.error').hasClass("hidden")) {
			eraseError(element)
		}
		return true;
	}
	if( obj['id'].length < 1 ){
		element.next('.error').text(errorResponses['missing'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	else if (!element.next('.error').hasClass("hidden")) {
		eraseError(element)
	}
	return true;
}

function checkVideoLink(element){
	if(element && element.val() && !( isYouTubeLink(element.val()))){
		element.next('.error').text(errorResponses['invalid'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	else if (!element.next('.error').hasClass("hidden")) {
		eraseError(element)
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
	var data = {
		id: [],
		label: []
	};
	el.each(function(index, value){
		console.log()
		$(value).attr('data-id') ? data['id'].push($(value).attr('data-id')) : data['label'].push($(value).attr('data-name'));
	})

	return data;
}

/**
 * set multiple values on the pill widget
 * @return {[type]} [description]
 */
function setPillValues(elementId, arr, globalArray){
	arr.forEach(function(value, index){
		if(globalArray)
			globalArray.forEach(function(anItem){
				if(value==anItem['val']){
					var label = anItem['text']
					var id = anItem['val']
					addNewTag(label, id, '#'+elementId+'')
				}
			})
		else{
			var label = value
			var id =""
			addNewTag(label, id, '#'+elementId+'')
		}
	})
}

function eraseError(element){
	element.removeClass("error-border");
	element.next('.error').text('').addClass("hidden");
}

function ifGreater(elementA, elementB){
	console.log(elementB.val())
	console.log(elementA.val())
	console.log(typeof(elementA.val()), typeof(elementB.val()))
	var val1 = parseInt(elementB.val());
	var val2 = parseInt(elementA.val());
	if(val1 && val2 && !( val1 >= val2)){
		elementA.siblings('.error').text(errorResponses['invalid'+elementA.attr('name')]).removeClass("hidden");
		focusOnElement(elementA)
		elementB.addClass("error-border");

		console.log('returning false')
		return false;
	}
	else if (!elementA.siblings('.error').hasClass("hidden")) {
		elementA.siblings('.error').text('').addClass("hidden");
		elementA.removeClass("error-border");
		elementB.removeClass("error-border");
	}

	return true;
}

function focusOnElement(element) {
	element.addClass("error-border");
	$('html, body').animate({
		scrollTop: (element.closest('.field-container').offset().top)
	},200);
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

/**
 * set multiple checboxes
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function setMultipleCheckboxes(elementId, arr){
	$.each(arr, function( index, value ) {
		var el = $('#'+elementId+ ' .field .course-option input[data-id='+value+']');
		el.prop("checked","true");
	})
}
function check_youtube_embed(url) {
    var id = url.split("?v=")[1];
    var embedlink = "http://www.youtube.com/embed/" + id;
    if(url.indexOf('youtube.com/') !== -1) {
        jQuery(".youtube-preview").removeClass("hidden").find("iframe").attr("src", embedlink);
    } else {
        jQuery(".youtube-preview").addClass("hidden")
    }
}

function bindGuidelineModalFunctionality() {
	var guidelineModalTrigger = jQuery(".guideline-modal-trigger");
	var $body = $("body");
	var $modalOverlay = $(".modal-overlay");

	guidelineModalTrigger.on("click", function() {
	    $body.addClass("posf");
	    $modalOverlay.removeClass("hidden")
	});

	$modalOverlay.on('click', function(e) {
	    if (jQuery(e.target).is(".modal-overlay")) {
	        jQuery(this).addClass("hidden");
	        $body.removeClass("posf")
	    }
	});

	$modalOverlay.on('click', ".close-modal",function(e) {
	    $body.removeClass("posf");
	    $modalOverlay.addClass("hidden");
	});
}