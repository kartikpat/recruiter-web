var jobTagsArray = {}

var errorResponses = {
	missingTitle: 'Please enter the job title',
	maxLimitTitle: 'Cannot exceed 120 letters',
	minLimitTitle: 'Atleast 3 letters',
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

var city={
		"Anywhere": {
			"0": "Any Location",
			"87": "Metros",
			"88": "Anywhere in India/Multiple Locations",
			"89": "Overseas/International"
		},
		"National Locations": {
			"1": "Delhi NCR",
			"2": "Mumbai",
			"3": "Bangalore",
			"4": "Hyderabad",
			"5": "Kolkata",
			"6": "Chennai",
			"7": "Pune",
			"8": "Gujarat",
			"9": "Maharashtra",
			"10": "MP",
			"11": "Jaipur",
			"12": "Guwahati",
			"13": "Goa",
			"14": "Chandigarh",
			"15": "Punjab",
			"16": "Haryana",
			"17": "Kerala",
			"18": "Orrisa",
			"19": "Bihar",
			"20": "Jharkhand",
			"21": "UP",
			"31": "Karnataka",
			"32": "Tamil Nadu",
			"33": "Rajasthan",
			"34": "Andhra Pradesh",
			"35": "Telangana",
			"36": "Delhi",
			"37": "Gurgaon/Gurugram",
			"38": "Noida",
			"39": "Greater Noida",
			"40": "Faridabad",
			"41": "Ghaziabad",
			"42": "Jammu & Kashmir",
			"43": "Jammu",
			"44": "Srinagar",
			"45": "Amritsar",
			"46": "Jalandhar",
			"47": "Patiala",
			"48": "Ludhiana",
			"49": "Sonipat",
			"50": "Panipat",
			"51": "Udaipur",
			"52": "Jodhpur",
			"53": "Ahmedabad",
			"54": "Surat",
			"55": "Gandhinagar",
			"56": "Vadodara/Baroda",
			"57": "Haridwar",
			"58": "Dehradun",
			"59": "Uttarakhand",
			"60": "Lucknow",
			"61": "Patna",
			"62": "Ranchi",
			"63": "Jamshedpur",
			"64": "Chhattisgarh",
			"65": "Bhubaneshwar",
			"66": "Nagpur",
			"67": "Nasik",
			"68": "Navi Mumbai",
			"69": "Thane",
			"70": "Cochin/Kochi",
			"71": "Hosur",
			"72": "Hubli",
			"73": "Mysore",
			"74": "Raipur",
			"75": "Trivandrum/Thiruvananthapuram",
			"76": "Vijayawada",
			"77": "Guntur",
			"78": "Vishakhapatnam/Vizag",
			"79": "Aurangabad",
			"80": "Rajkot",
			"81": "Varanasi/Banaras",
			"82": "Warangal",
			"83": "Madurai",
			"84": "Coimbatore",
			"85": "Pondicherry",
			"86": "Cuttack"
		},
		"International Locations": {
			"22": "US",
			"23": "UK",
			"24": "Singapore",
			"25": "Middle East",
			"26": "Africa",
			"27": "Malaysia",
			"28": "EU",
			"30": "Hong Kong",
			"90": "Bahrain",
			"91": "Dubai",
			"92": "Kabul",
			"93": "Kuwait",
			"94": "Nigeria",
			"95": "London",
			"96": "Oman",
			"97": "Muscat",
			"98": "Doha",
			"99": "Qatar",
			"100": "Abu Dhabi",
			"101": "Saudi Arabia",
			"102": "Riyadh",
			"103": "Indonesia",
			"104": "Nepal",
			"105": "Bhutan",
			"106": "Dhaka",
			"107": "Bangladesh",
			"108": "China",
			"109": "Afghanistan",
			"110": "Pakistan",
			"111": "Sri Lanka",
			"112": "Ethiopia",
			"113": "Egypt",
			"114": "Kenya",
			"115": "Nairobi",
			"116": "Tanzania",
			"117": "South Africa",
			"118": "Zimbabwe",
			"119": "Zambia",
			"120": "Philippines"
		},
		"Others": {
			"100000": "Others"
		}
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
			settings.initialPremium = null
			setAvailableCredits(settings.creditsText, config["availableCredits"]);
			onClickCancelForm(settings.cancelFormButton);
			appendlocation();

			var salaryRange = 100;
			for(var i=0; i< salaryRange; i++){
				settings.maxSal.append('<option value="'+(i+1)+'">'+(i+1)+'</option>')
				settings.minSal.append('<option value="'+(i+1)+'">'+(i+1)+'</option>')
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
			premium: settings.isPremium.is(':checked') ? true : false,
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
				cnfi: settings.confidential.is(':checked') ? true : false
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


		// setPillValues(settings.location.attr('id'), loca);
		setPillValues(settings.location.attr('id'), obj["location"], currentLocationTagsData);
		setPillValues(settings.location.attr('id'), obj["otherLocation"]);
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
		if(obj["batch"] && obj["sal"]["min"]!= 0 && obj["sal"]["max"]!=0) {
			settings.batchFrom.val(obj["batch"]["min"]);
			settings.batchTo.val(obj["batch"]["max"]);
		}
		settings.submitButton.text("Update")
	}


	function submitHandler(fn){
		$(settings.submitButton).click(fn)
	}


	function populateJobTags(dataArray) {
		var str = ""
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
		var ul =$("#listing");	
		for(var key in city) {
			console.log("------" +key)
			for(var key1 in city[key]) {
				 console.log(city[key][key1]);
				 var loc=city[key][key1];
				 console.log(key1);
				 ul.append('<li data-value='+key1+'>'+loc+'</li>');
			}
		}
		return
	
        var li = document.createElement("li");
        li.appendChild();
        ul.appendChild(li);	
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
				debugger
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
