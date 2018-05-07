var jobTagsArray = {}

var errorResponses = {
	missingTitle: 'Please enter the job title',
	maxLimitTitle: 'Cannot exceed 120 letters',
	minLimitTitle: 'Atleast 3 letters',
	missingLocation: 'Please choose a location',
	missingMinExp: 'Please choose years of experience required for the job',
	missingMaxExp: 'Please choose years of experience required for the job',
	missingDescription: 'Please fill the job description',
	invalidVideoUrl: 'Please enter a youtube URL here',
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
			settings.listing=$("#listing"),
			settings.creditsText = $('#creditsText');
			settings.initialPremium = null;
			settings.industryListing = $("#industryListing")
			setAvailableCredits(settings.creditsText, config["availableCredits"]);
			onClickCancelForm(settings.cancelFormButton);


			var salaryRange = 101;
			for(var i=0; i< salaryRange; i++){
				if(i>=100){
					settings.maxSal.append('<option value="'+(i+1)+'">'+(i)+"+"+'</option>')
					settings.minSal.append('<option value="'+(i+1)+'">'+(i)+"+"+'</option>')
				}
				else{
				settings.maxSal.append('<option value="'+(i+1)+'">'+(i+1)+'</option>')
				settings.minSal.append('<option value="'+(i+1)+'">'+(i+1)+'</option>')
				}
			}

			settings.editor = new MediumEditor("#job_description", {
				toolbar: false,
				placeholder: {
			        text: 'Describe the role, talk about the role and responsibilities and help potential applicants understand what makes this a great opportunity.'
			    },
				disableExtraSpaces: true,
				hideOnClick: false
			})

			settings.editor.subscribe('editableInput', function(event, editorElement){

			})
			jQuery(".header .menu-list-item.my-jobs").addClass("active");
			appendlocation();
			appendindustry();
	}

	function onChangeJobPremium(fn) {
		settings.isPremium.change(function() {
			if(settings.initialPremium) {
				if(this.checked) {
					return settings.creditsText.text("You have "+config["availableCredits"]+" credits left.")
				}
				if(config["availableCredits"]) {
					settings.creditsText.text(" You will have "+(parseInt(config["availableCredits"])+1)+" credits left.")
					return
				}
			}
			if(this.checked) {
				if(config["availableCredits"]) {
					if(config["availableCredits"] == 0) {
						$(this).prop("checked", false)
						return settings.creditsText.text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")
					}
					settings.creditsText.text("This job will be posted as premium. You will have "+(parseInt(config["availableCredits"])-1)+" credits left.")
					return
				}
				$(this).prop("checked", false)
				return settings.creditsText.text("You don’t have any premium credits right now! We’ll reach out to you to help you with it!")

			}
			settings.creditsText.text("You have "+config["availableCredits"]+" credits left.")
		})
	}

	function loginHandler(fn){
		settings.login.click(fn);
	}

	function validate(){

		if(!(
				ifExists(settings.title)
				&& wordsLimit(settings.title)
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

			return false;
		}
		return true;
		if(Object.keys(settings).length ===0){

			return false
		}
		for(var key in settings){
			if([ "title", "location", "minExp", "maxExp", "jobDescription",  "category", "functionalArea"].indexOf(key) > -1){
				if(!(settings.key && settings.key)){

					return
				}
			}
			if(["location", "industry"].indexOf(key) > -1){
				if(!(settings.key && settings.key)){

					return
				}
				if(!(settings.key.length <5)){

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
		else
			ob.tags = [];
		if(settings.videoUrl.val() && settings.videoUrl.val() !='')
			ob.videoUrl = settings.videoUrl.val()
		else
			ob.videoUrl = ""
		if( getMultipleCheckboxes(settings.courseType.attr('id')).length >0)
			ob.courseType = getMultipleCheckboxes(settings.courseType.attr('id'))
		else
			ob.courseType = [];
		if( getMultipleCheckboxes(settings.preferences.attr('id')).length >0)
			ob.preferences = getMultipleCheckboxes(settings.preferences.attr('id'))
		else
			ob.preferences = [];
		if(settings.minSal.val() && settings.maxSal.val()) {
			ob.sal = {
				min: settings.minSal.val(),
				max: settings.maxSal.val(),
				hide: settings.confidential.is(':checked') ? 1 : 0
			}
		}
		else {
			ob.sal = {
				min: 0,
				max: 0,
				hide: settings.confidential.is(':checked') ? 1 : 0
			}
 		}
		if(settings.minExp.val() && settings.maxExp.val())
			ob.exp = {
				min: settings.minExp.val(),
				max: settings.maxExp.val()
			}
		if(settings.batchFrom.val() && settings.batchTo.val() ) {
			ob.batch = {
				min: settings.batchFrom.val(),
				max: settings.batchTo.val()
			}
		}
		else {
			ob.batch = {
				min: "",
				max: ""
			}
		}
		return ob;
	}

	function getTitleFormat(title, regex) {
		return title.replace(regex, '');
	}

	function setJobData(jobId, obj) {
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


	function submitHandler(fn){
		settings.submitButton.click(fn)
	}


	function populateJobTags(dataArray) {
		var str = '<li data-value="custom" class="hidden"></li>'
		dataArray.forEach(function(aTag, index){
			var item = $(".jobTag.prototype").clone().removeClass("prototype hidden")
			item.text(aTag["name"])
			item.attr("data-value",aTag["id"])
			item.attr("data-name", aTag["name"])
			str += item[0].outerHTML
		})
		$("#jobTagsList").html(str)

	}

	function appendlocation(){
		var str = '<li data-value="custom" class="hidden"></li>'
		for(var locCategory in cityList) {
			str += '<li class="disabled">--'+locCategory+'--</li>'
			for(var locId in cityList[locCategory]) {
				 var loc = cityList[locCategory][locId];
				 str += '<li data-value='+locId+'>'+loc+'</li>'
			}
		}
		settings.listing.html(str);
	}

	function appendindustry(){
		var str = ''
		industryTagsData.forEach(function(anIndustry){
			str += '<li data-value='+anIndustry["val"]+'>'+anIndustry["text"]+'</li>'
		})
		settings.industryListing.html(str);
	}



	return {
		init: init,
		setConfig : setConfig,
		validate: validate,
		getData: getJobData,
		submitHandler: submitHandler,
		setData: setJobData,
		onChangeJobPremium: onChangeJobPremium,
		populateJobTags: populateJobTags,
		appendlocation:appendlocation,
		appendindustry:appendindustry
	}

}

function setAvailableCredits(element, credits) {
	if(!credits) {
		return element.html("Reach out to more candidates in less amount of time by making your job premium. <a target='_blank' style='color:#155d9a' href='/recruiter/recruiter-plan'>Learn More.</a>")
	}
	if(credits == 0) {
		return element.html("You have used up all your credits. <a target='_blank' style='color:#155d9a' href='/recruiter/recruiter-plan'>Click here</a> to buy more credits.")
	}
	element.text("You have "+credits+" credits left.")
}


function onClickCancelForm(element) {
	element.click(function() {
		var eventObj = {
			event_category: eventMap["cancelJobClick"]["cat"],
			event_label: 'origin=PostJobForm,recId='+recruiterId+''
		}
		sendEvent(eventMap["cancelJobClick"]["event"], eventObj)
		window.location.href = "/my-jobs"
	})
}

function wordsLimit(element) {
	var errorElement = element.next('.error');
	if(element && element.val() && element.val().length < 3){
		errorElement.text(errorResponses['minLimit'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	if(element && element.val() && element.val().length > 120){
		errorElement.text(errorResponses['maxLimit'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	else if (!errorElement.hasClass("hidden")) {
		eraseError(element)

	}

	return true;
}


function ifExists(element) {
	var errorElement = element.next('.error').length ? element.next('.error') : element.siblings('.error');
	if(!( element && (element.val()).trim() )){
		errorElement.text(errorResponses['missing'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)

		return false;
	}
	else if (!errorElement.hasClass("hidden")) {
		eraseError(element)

	}

	return true;
}

function checkPillValues(element) {
	var obj = getPillValues(element.attr('id'))

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
	if(elementId == "jobTags") {
		el.each(function(index, value){
			data['label'].push($(value).attr('data-name'));
		})
		return data
	}
	el.each(function(index, value){
		$(value).attr('data-id') ? data['id'].push($(value).attr('data-id')) : data['label'].push($(value).attr('data-name'));
	})
	return data;
}

function setPillValuesByObject(elementId, arr, globalObject){

	arr.forEach(function(value, index){
		$('#'+elementId+'').find(".pill-listing li[data-value='"+value+"']").addClass("selected")
		for(var locCategory in cityList) {
			if(cityList[locCategory][value]) {
				var label = cityList[locCategory][value]
				var id = value
				addNewTag(label, id, '#'+elementId+'')
			}
		}
	})
}


/**
 * set multiple values on the pill widget
 * @return {[type]} [description]
 */
function setPillValues(elementId, arr, globalArray){

	arr.forEach(function(value, index){

		if(globalArray) {
			$('#'+elementId+'').find(".pill-listing li[data-value='"+value+"']").addClass("selected")
			globalArray.forEach(function(anItem){
				if(value==anItem['val']){
					var label = anItem['text']
					var id = anItem['val']
					addNewTag(label, id, '#'+elementId+'')
				}
			})
		}

		else{
			if(elementId == "jobTags") {
				$('#'+elementId+'').find(".pill-listing li[data-name='"+value+"']").addClass("selected")
			}
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

	var val1 = parseInt(elementB.val());
	var val2 = parseInt(elementA.val());
	if(val1 && val2 && !( val1 >= val2)){
		elementA.siblings('.error').text(errorResponses['invalid'+elementA.attr('name')]).removeClass("hidden");
		focusOnElement(elementA)
		elementB.addClass("error-border");
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
