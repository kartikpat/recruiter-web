var errorResponses = {
	invalidminSal: 'Maximum Salary should be greater than Minimum Salary',
	invalidminBatch: 'Maximum Batch should be greater than Minimum Batch',
	invalidminExp: 'Maximum Years of Experience should be greater than Minimum Years of Experience',
	invalidminAge: 'Maximum Age should be greater than Minimum Age'
}

function Filters(){
	var settings = {};
	var filtersTarget = {
		industry: {
			target: $(".jsIndustry") ,
			type: 'checkbox',
			selection: [],
			label: [],
			count: 0
		},
		functionalArea: {
			target: $(".jsFuncArea"),
			type: 'checkbox',
			selection: [],
			label: [],
			count: 0
		},
		currentLocation:  {
			target: $(".jsCurLoc") ,
			type: 'checkbox',
			selection: [],
			label: [],
			count: 0
		},
		preferredLocation: {
			target: $(".jsPrefLoc"),
			type: 'checkbox',
			selection: [],
			label: [],
			count: 0
		},
		institute: {
			target: $(".jsInstitute"),
			type: 'checkbox',
			selection: [],
			label: [],
			count: 0
		},
		language: {
			target:  $(".jsLanguage"),
			type: 'checkbox',
			selection: [],
			label: [],
			count: 0
		},
		experience: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minExp"),
					selection: -1,
				},
				max: {
					target: $("#maxExp"),
					selection: -1
				}
			}
		},
		batch: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minBatch"),
					selection: -1
				},
				max: {
					target: $("#maxBatch"),
					selection: -1
				}
			}
		},
		salary: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minSal"),
					selection: -1
				},
				max: {
					target: $("#maxSal"),
					selection: -1
				}
			}
		},
		age: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minAge"),
					selection: -1
				},
				max: {
					target: $("#maxAge"),
					selection: -1
				}
			}
		},
		sex : {
			target: $("#gender"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		notice: {
			target: $("#noticePeriod"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		applicationDate : {
			target: $("#applicationDate"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		lastActive: {
			target: $("#lastSeen"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		permit: {
			target: $("#workPermit"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		handleTeam: {
			target: $("#handleTeam"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		relocate: {
			target: $("#relocate"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		differentlyAbled: {
			target: $("#differentlyAbled"),
			type: 'dropdown',
			selection: -1,
			label: ""
		},
		searchString: {
			target: $("#searchInput"),
			type: 'input',
			selection: null
		},
		orderBy: {
			target: $("#sortBySelect"),
			type: 'dropdown',
			selection: 1
		}
	}

	function init(){
		settings.searchButton = $("#searchButton");
		settings.filterButton = "";
		settings.sortButton = "";
		settings.appliedFiltersContainer = $(".active-filters .clear-all-filters .appliedFilters");
		settings.resultText = "";
		settings.clearButtton = $(".clear-all-filters");
		// settings.activeFilters = $(".active-filters .filter-tag");
		settings.activeFiltersContainer = $(".active-filters");
		settings.filterModal = $(".jsFiltersModal");
		settings.filterModalCancelButton = settings.filterModal.find('.close_modal');
		settings.candidatesContainer = $('#candidatesArea');
		settings.checkbox = $(".jsCheckInput.prototype");
		settings.removeFilterButtonClass = ".remove-active-filter";
		settings.applyFilterButton = $(".applyFilterButton");
		settings.activeFilterListingClass = ".activeFilterListing";
		settings.filterPill = $(".prototype.filterPill")
		settings.filterSearch = $(".filterSearch");
		settings.sortBy = $("#sortBy");
		settings.clearAllFitersButton = $("#clear-all");
		settings.resultFoundText = $("#resultFound");
		settings.filterModalOpenButton = $("#filterModalOpenButton");
		settings.searchCandidateError = $("#searchCandidateError")
		settings.topInstitutesContainer = $(".topInstitutesContainer")
		settings.jsInstitute = $(".jsInstitute")
		settings.topinstitute = {
			"topinst": 0,
			"lawinst": 0
		};
		settings.topinstInput = $("#topinst");
		settings.lawinstInput = $("#lawinst");
		settings.candidatesSearchResults = $("#candidatesSearchResults")
		settings.seeFilters = $("#seeFilters");
		settings.maxFilters = 7;
		settings.emptyView = $(".empty-screen");
		setOnClickFilters();
		setOnClickCloseFilters();
		onInputSearchFilter()
		onClickFiltersCheckBox()
		onChangeFiltersDropdownHalf()
		onClickSeeFilters()
		onClickTopInstituteContainer()

		jQuery(".modal_overlay").on("click",".category_listing li",function() {

		  var dataNameBefore = $(this).closest(".category_listing").find("li.active").attr("data-name")
		  if(!checkForError(dataNameBefore)) {
              return
          }
		  setAppliedFilters(dataNameBefore)
		  jQuery(this).addClass("active");
		  jQuery(this).siblings().removeClass("active");
		  var title = jQuery(this).find(".label-name").text();
		  var selector = jQuery(this).attr("data-selector");
		  var dataName = jQuery(this).attr("data-name");
		  if(['industry', 'functional-area', 'cur-loc', 'pref-loc', 'institute', 'language'].indexOf(selector) == -1) {
		      $(".filterSearch").addClass("hidden");
		  }
		  else {
		      $(".filterSearch").val('').removeClass("hidden");
		      jQuery(".modal_overlay").find(".subcategory_listing."+selector+" .check-input").removeClass("hidden")
		  }
		  if(selector == "institute") {
			  $(".topInstitutesContainer").removeClass("hidden")
		  }
		  else {
			  $(".topInstitutesContainer").addClass("hidden")
		  }
		  jQuery(".modal_content").find(".modal_body .modal_body_header .title").html(title);
		  jQuery(".modal_content").find(".mobile-header .title").html(title);
		  jQuery(".modal_overlay").find(".subcategory_listing").addClass('hidden').removeClass('activeFilterListing');
		  jQuery(".modal_overlay").find(".subcategory_listing." + selector).removeClass('hidden').addClass('activeFilterListing');
		  jQuery(".modal_body").scrollTop(0);

		});
	}

	function onClickSeeFilters() {
		settings.seeFilters.click(function(){
			settings.activeFiltersContainer.toggleClass("collapsed");
			if(settings.activeFiltersContainer.hasClass("collapsed")) {
				return $(this).text("See More").removeClass("hidden");
			}
			return $(this).text("See Less").removeClass("hidden");
		})
	}

	function onClickTopInstituteContainer() {
		settings.topInstitutesContainer.find("input").click(function(){
				var label = $(this).attr("id")
				var name = "institute"
				if($(this).is(":checked")) {
					settings.jsInstitute.find("input[data-top="+label+"]").prop("checked", true)
					filtersTarget[name]["count"] += settings.jsInstitute.find("input[data-top="+label+"]").length
					settings.topinstitute[label] += settings.jsInstitute.find("input[data-top="+label+"]").length
				}
				else {
					settings.jsInstitute.find("input[data-top="+label+"]").prop("checked", false)
					filtersTarget[name]["count"] -= settings.jsInstitute.find("input[data-top="+label+"]").length
					settings.topinstitute[label] -= settings.jsInstitute.find("input[data-top="+label+"]").length
				}
				if(filtersTarget[name]['count'])
					return settings.filterModal.find(".modal_sidebar li[data-name="+name+"] .filterCount").text('('+filtersTarget[name]['count']+')').removeClass("hidden")
				return settings.filterModal.find(".modal_sidebar li[data-name="+name+"] .filterCount").addClass("hidden")

		})
		settings.topInstitutesContainer.find("label").click(function(){
			event.stopPropagation()
		})
	}

	function onChangeFiltersDropdownHalf() {
		settings.filterModal.on('change', '.select-dropdown', function(){
			var name = $(settings.activeFilterListingClass).attr('data-label');
			checkForError(name)
		})
	}

	function onClickFiltersCheckBox() {
		settings.filterModal.on('click', '.subcategory_listing .check-input input', function(){
			var name = $(settings.activeFilterListingClass).attr('data-label');
			var type = filtersTarget[name]['type']
			if(type == "checkbox"){
				if($(this).is(":checked")) {
					filtersTarget[name]['count'] += 1;
				}
				else {

					filtersTarget[name]['count'] -= 1;
				}
				if(filtersTarget[name]['count'])
					return settings.filterModal.find(".modal_sidebar li[data-name="+name+"] .filterCount").text('('+filtersTarget[name]['count']+')').removeClass("hidden")
				return settings.filterModal.find(".modal_sidebar li[data-name="+name+"] .filterCount").addClass("hidden")
			}
		})
		settings.filterModal.on('click', '.check-input label', function(){
			event.stopPropagation()
		})
	}

	function onClickApplyFilterButton(fn){
		settings.applyFilterButton.click(function(e){

			var name = $(settings.activeFilterListingClass).attr('data-label');
			fn(name);
		})
	}

	function onClickRemoveFilter(fn){
		settings.activeFiltersContainer.on('click', settings.removeFilterButtonClass, function(e){
			var filterElement = $(this).closest('.filter-tag');
			var value = filterElement.attr('data-value');
			var category = filterElement.attr('data-category');
			var type = filterElement.attr('data-type');
			filterElement.remove();
			fn(value,category,type)
		})
	}

	function onClickRemoveAllFilters(fn) {
		settings.clearAllFitersButton.click(function(){
			removeAllFilters()
			fn()
		})
	}

	function onClickSearchButton(fn){
		var orderBySelect = filtersTarget["orderBy"]["target"]
		settings.searchButton.click(function(event){

			var str = (filtersTarget["searchString"]["target"].val()).trim();

			if(str == '') {
				orderBySelect.removeClass("hidden")
			}
			else {
				orderBySelect.addClass("hidden")
			}
			filtersTarget["searchString"]["selection"] = str;
			fn();
		})

		filtersTarget["searchString"]["target"].keyup(function(event){

            if (event.which == 13) {
				var str = (filtersTarget["searchString"]["target"].val()).trim();
				if(str == '') {
					orderBySelect.removeClass("hidden")
				}
				else {
					orderBySelect.addClass("hidden")
				}
				filtersTarget["searchString"]["selection"] = str;
                fn();
            }
        });
	}

	function onSelectSortByOption(fn) {
		filtersTarget["orderBy"]["target"].change(function() {
			var sortById = $(this).val();
		    filtersTarget.orderBy.selection = sortById;
			fn()
		})
	}

	function onInputSearchFilter() {
		settings.filterSearch.on('input', function(){
			var str = ($(this).val()).trim();
			if(!str) {
				return
			}
			var dataLabel = $(settings.activeFilterListingClass).attr("data-label");
			if(dataLabel == "functionalArea") {
				searchTags(dataLabel, functionalAreaTagsData, str)
			}
			if(dataLabel == "industry") {
				searchTags(dataLabel, industryTagsData, str)
			}
			if(dataLabel == "currentLocation") {
				searchTags(dataLabel, currentLocationTagsData, str)
			}
			if(dataLabel == "preferredLocation") {
				searchTags(dataLabel, currentLocationTagsData, str)
			}
			if(dataLabel == "institute") {
				searchTags(dataLabel, instituteTagsData, str)
			}
			if(dataLabel == "language") {
				searchTags(dataLabel, languageTagsData, str)
			}
		})
	}

	function setOnClickFilters() {
        settings.filterModalOpenButton.click(function(event){
		//	debugger
				if(settings.topinstitute.topinst > 0) {
					settings.topinstInput.prop("checked", true)
				}
				else {
					settings.topinstInput.prop("checked", false)
				}
				if(settings.topinstitute.lawinst > 0) {
					settings.lawinstInput.prop("checked", true)
				}
				else {
					settings.lawinstInput.prop("checked", false)
				}

				for (var key in filtersTarget) {
					if(filtersTarget[key]["type"] == "checkbox") {
						filtersTarget[key]["count"] = 0
						filtersTarget[key]['target'].find('input').prop('checked', false)
						filtersTarget[key]["selection"].forEach(function(value){
							filtersTarget[key]['target'].find('input[value='+value+']').prop('checked', true)
							filtersTarget[key]["count"] += 1
						})

						if(filtersTarget[key]['count']) {

							settings.filterModal.find(".modal_sidebar li[data-name="+key+"] .filterCount").text('('+filtersTarget[key]['count']+')').removeClass("hidden")
						}
						else {
							settings.filterModal.find(".modal_sidebar li[data-name="+key+"] .filterCount").addClass("hidden")
						}
					}
					else if(filtersTarget[key]["type"] == "dropdownHalf") {

						for (var k in filtersTarget[key]["props"]) {

							filtersTarget[key]["props"][k]['target'].val(filtersTarget[key]["props"][k]["selection"])
						}
					}
					else if(filtersTarget[key]["type"] == "dropdown") {

						if(key == "orderBy") {

							continue
						}
						filtersTarget[key]['target'].val(filtersTarget[key]["selection"])
					}
				}
				addBodyFixed()
	            settings.filterModal.removeClass("hidden");
			})

    }

    function setOnClickCloseFilters(){
    	settings.filterModalCancelButton.click(function(event){

    		removeBodyFixed();
            settings.filterModal.addClass("hidden");
    	})
		settings.filterModal.click(function(event){
			if($(event.target).parents(".modal_content").length) {
				return event.stopPropagation();
			}

			removeBodyFixed();
            settings.filterModal.addClass("hidden");
		})

    }

	function createPill(value, label, category, type){
		var aFilter = settings.filterPill.clone().removeClass('hidden prototype');
		aFilter.attr('data-category', category)
		aFilter.attr('data-value', value);
		aFilter.attr('data-type', type);
		aFilter.find('.icon-label').text(category + ": " + label)


		return aFilter;
	}

	function addFilterToContainer(value, label, category, type){
		var aFilter = createPill(value, label, category, type);
		settings.appliedFiltersContainer.prepend(aFilter);
		if(settings.appliedFiltersContainer.children().length >= settings.maxFilters) {
			settings.activeFiltersContainer.addClass("collapsed");
			settings.seeFilters.removeClass("hidden");
		}
	}

	function removeAllFilters(){
		for (var key in filtersTarget) {
			if(filtersTarget[key]["type"] == "checkbox") {

				filtersTarget[key]["selection"] = [];
				filtersTarget[key]["label"] = [];
				filtersTarget[key]["count"] = 0
				filtersTarget[key]['target'].find('input').prop('checked', false)
				settings.filterModal.find(".modal_sidebar li[data-name="+key+"] .filterCount").addClass("hidden")
			}
			else if(filtersTarget[key]["type"] == "dropdownHalf") {
				for (var k in filtersTarget[key]["props"]) {
					filtersTarget[key]["props"][k]["selection"] = -1;
					filtersTarget[key]["props"][k]['target'].val("-1")
				}
			}
			else if(filtersTarget[key]["type"] == "dropdown") {
				if(key == "orderBy") {
					continue
				}
				filtersTarget[key]["selection"] = -1;
				filtersTarget[key]["label"] = ""
				filtersTarget[key]['target'].val("-1")
			}
		}

		settings.activeFiltersContainer.find(".filter-tag").remove();
		settings.activeFiltersContainer.addClass("hidden")
		settings.clearAllFitersButton.addClass("hidden");
		settings.seeFilters.addClass("hidden")
		settings.topinstitute.topinst = 0;
		settings.topinstitute.lawinst = 0;
		settings.resultFoundText.addClass("hidden");
	}

	function removeFilter(value,category,type) {
		if(type == "checkbox"){
			var index = filtersTarget[category]['selection'].indexOf(value)
			if(index > -1){
				filtersTarget[category]['selection'].splice(index, 1);
				filtersTarget[category]['label'].splice(index, 1);
				filtersTarget[category]['count'] -= 1;
				filtersTarget[category]['target'].find('input[value='+value+']').prop('checked', false)
				if(filtersTarget[category]['count']){
					settings.filterModal.find(".modal_sidebar li[data-name="+category+"] .filterCount").text('('+filtersTarget[category]['count']+')').removeClass("hidden")
				}
				else {
					settings.filterModal.find(".modal_sidebar li[data-name="+category+"] .filterCount").addClass("hidden")
				}
			}
		}
		else if(type == "dropdownHalf"){
			var temp = category.split("-");
			var key = temp[0];
			var category = temp[1];
			var str = filtersTarget[category]["props"][key]['selection'];
			if(str != -1){
				filtersTarget[category]["props"][key]['selection'] = -1;
				filtersTarget[category]["props"][key]['target'].val("-1")
			}
		}
		else if(type == "dropdown"){
			var str = filtersTarget[category]['selection']
			if(str != -1){
				filtersTarget[category]['selection'] = -1;
				filtersTarget[category]['label'] = ""
				filtersTarget[category]['target'].val("-1")
			}
		}

		if(!settings.activeFiltersContainer.find(".filter-tag").length) {
			settings.clearAllFitersButton.addClass("hidden");
			settings.activeFiltersContainer.addClass("hidden")
			settings.resultFoundText.addClass("hidden");
		}

		else if(settings.activeFiltersContainer.find(".filter-tag").length < settings.maxFilters) {
			settings.activeFiltersContainer.removeClass("collapsed")
			settings.seeFilters.addClass("hidden");
		}

	}

	function addFiltersToContainer(){
		settings.appliedFiltersContainer.empty();
		for (var key in filtersTarget) {

			if(filtersTarget[key]["type"] == "checkbox") {
				filtersTarget[key]["selection"].forEach(function(value,index){
					addFilterToContainer(value, filtersTarget[key]["label"][index], key, "checkbox");
				})
			}
			else if(filtersTarget[key]["type"] == "dropdownHalf") {

				for (var k in filtersTarget[key]["props"]) {
					if(filtersTarget[key]["props"][k]["selection"] != -1) {
						addFilterToContainer(filtersTarget[key]["props"][k]["selection"],filtersTarget[key]["props"][k]["selection"] , k +"-"+ key, "dropdownHalf");
					}

				}
			}
			else if(filtersTarget[key]["type"] == "dropdown") {

				if(key == "orderBy") {
					continue
				}
				if(filtersTarget[key]["selection"] != -1)
					addFilterToContainer(filtersTarget[key]["selection"], filtersTarget[key]["label"], key, "dropdown");
			}
		}
	}



	function setAppliedFilters(name){

		var type = filtersTarget[name]['type']

		if(type == "checkbox"){
			filtersTarget[name]['selection'] = [];
			filtersTarget[name]['label'] = [];
			filtersTarget[name]['target'].find('input:checked').each(function(index, el){
				filtersTarget[name]['label'].push($(el).attr('data-label'))
				filtersTarget[name]['selection'].push(el.value)
			})
		}
		else if(type == "dropdownHalf"){
			for(var key in filtersTarget[name]["props"]) {
				var value = filtersTarget[name]["props"][key]['target'].val();

				filtersTarget[name]["props"][key]['selection'] = value
				// var label = value;

			}
		}
		else if(type == "dropdown"){
			var value = filtersTarget[name]['target'].val();

			filtersTarget[name]['selection'] = value
			filtersTarget[name]['label'] = filtersTarget[name]['target'].find('option:selected').text();
		}
	}

	function getAppliedFilters(){
		var ob ={};
		if(filtersTarget.industry.selection.length >0)
			ob.industry = filtersTarget.industry.selection.join(',');
		if(filtersTarget.currentLocation.selection.length > 0)
			ob.location = filtersTarget.currentLocation.selection.join(',');
		if(filtersTarget.preferredLocation.selection.length > 0)
			ob.preferredLocation = filtersTarget.preferredLocation.selection.join(',');
		if(filtersTarget.institute.selection.length > 0)
			ob.institute = filtersTarget.institute.selection.join(',');
		if(filtersTarget.functionalArea.selection.length > 0)
			ob.functionalArea = filtersTarget.functionalArea.selection.join(',');
		if(filtersTarget.language.selection.length > 0)
			ob.language = filtersTarget.language.selection.join(',');
		if(filtersTarget.experience.props.min.selection != -1)
			ob.minExp = filtersTarget.experience.props.min.selection
		if(filtersTarget.experience.props.max.selection != -1)
			ob.maxExp = filtersTarget.experience.props.max.selection
		if(filtersTarget.salary.props.min.selection != -1)
			ob.minCtc = filtersTarget.salary.props.min.selection
		if(filtersTarget.salary.props.max.selection != -1)
			ob.maxCtc = filtersTarget.salary.props.max.selection
		if(filtersTarget.age.props.min.selection != -1)
			ob.minAge = filtersTarget.age.props.min.selection
		if(filtersTarget.age.props.max.selection != -1)
			ob.maxAge = filtersTarget.age.props.max.selection
		if(filtersTarget.batch.props.min.selection != -1)
			ob.minBatch = filtersTarget.batch.props.min.selection
		if(filtersTarget.batch.props.max.selection != -1)
			ob.maxBatch = filtersTarget.batch.props.max.selection
		if(filtersTarget.sex.selection != -1)
			ob.sex = filtersTarget.sex.selection
		if(filtersTarget.notice.selection != -1)
			ob.notice = filtersTarget.notice.selection
		if(filtersTarget.applicationDate.selection != -1)
			ob.applicationDate = filtersTarget.applicationDate.selection
		if(filtersTarget.lastActive.selection != -1)
			ob.lastActive = filtersTarget.lastActive.selection
		if(filtersTarget.permit.selection != -1)
			ob.permit = filtersTarget.permit.selection
		if(filtersTarget.handleTeam.selection != -1)
			ob.handleTeam = filtersTarget.handleTeam.selection
		if(filtersTarget.relocate.selection != -1)
			ob.relocate = filtersTarget.relocate.selection
		if(filtersTarget.differentlyAbled.selection != -1)
			ob.differentlyAbled = filtersTarget.differentlyAbled.selection
		if(filtersTarget.searchString.selection)
			ob.searchString = filtersTarget.searchString.selection
		if(filtersTarget.orderBy.selection)
			ob.orderBy = filtersTarget.orderBy.selection
		return ob;
	}

	function addFilterData(name, data){
		if(name && ['industry', 'functionalArea', 'currentLocation', 'preferredLocation', 'institute', 'experience', 'batch', 'salary', 'age', 'gender', 'noticePeriod', 'appliedDate', 'lastSeen', 'workPermit', 'handleTeam', 'relocate', 'differentlyAbled', 'language'].indexOf(name) ==-1)
			return console.log('not a valid filter');

		if(filtersTarget[name]){
			var str = ''
			data.forEach(function(aRow){
				var checkbox = settings.checkbox.clone().removeClass("prototype hidden");
				checkbox.find(".in").attr("value", aRow["val"]);
			    checkbox.find(".in").attr("id", name+"-"+aRow["val"]);
			    checkbox.find(".lab").text(aRow["text"]);
			    checkbox.find(".in").attr('data-label', aRow["text"] )
			    checkbox.find(".lab").attr("for",name+"-"+aRow["val"]);
				if(aRow["isTop"]){
					checkbox.find(".in").attr("data-top", aRow["isTop"])
				}
			    str+= checkbox[0].outerHTML;
			})
			filtersTarget[name].target.html(str).attr('data-label', name);
		}
	}

	function searchTags(name, array, str) {
		str=str.toLowerCase();
		var resultTags = []
	    for (var i=0; i < array.length; i++) {
	        if (array[i]["text"] && array[i]["text"].toLowerCase().indexOf(str)>-1) {
	            resultTags.push(array[i]);
	        }
	    }
		showSearchResults(name ,resultTags)
	}

	function showSearchResults(name, resultTags) {
		filtersTarget[name].target.find(".jsCheckInput").addClass("hidden")
		var inputElem = filtersTarget[name].target.find("input");
		resultTags.forEach(function(obj) {

			filtersTarget[name].target.find("input[value='"+obj["val"]+"']").closest('.jsCheckInput').removeClass("hidden")
		})
	}

	function showResultsFound(totalFound) {
		if(filtersTarget["searchString"]["selection"]) {
			settings.resultFoundText.text(totalFound + " results found for " + filtersTarget["searchString"]["selection"]).removeClass("hidden");
			if(totalFound == 0) {
				$('.user-text').text('No applications for searched keyword');
				$('.empty-text').text("We couldn't find any results for the searched keyword.");
				settings.emptyView.removeClass('hidden');
				return
			}
		}
		settings.resultFoundText.text(totalFound + " results found for applied filters").removeClass("hidden");
		if(totalFound == 0) {
			$('.user-text').text('We couldn’t find any matches for the selected filter.');
			$('.empty-text').text('Please try using a different filter');
			settings.emptyView.removeClass('hidden');
		}
	}

	function hideAppliedFilters() {
		settings.activeFiltersContainer.addClass("hidden");
		settings.clearAllFitersButton.addClass("hidden");

	}

	function showAppliedFilters() {
		settings.activeFiltersContainer.removeClass("hidden");
		settings.clearAllFitersButton.removeClass("hidden")
	}

	function checkForError(name) {
		var type = filtersTarget[name]['type']
		if(type == "dropdownHalf"){
			var element = filtersTarget[name]["props"]["min"]['target'];
			var minValue;
			var	maxValue;
			for(var key in filtersTarget[name]["props"]) {
				if(key == "min") {
					minValue = parseInt(filtersTarget[name]["props"][key]['target'].val());
					continue
				}
				maxValue = parseInt(filtersTarget[name]["props"][key]['target'].val());
			}
			if(minValue != -1 && maxValue != -1 && maxValue < minValue) {
				element.next(".error-field").text(errorResponses['invalid'+element.attr('id')]).removeClass("hidden");
				return false
			}
			else {
				element.next(".error-field").addClass("hidden");
				return true
			}
		}
		return true
	}

	function closeFilterModal() {
		removeBodyFixed();
		settings.filterModal.addClass("hidden")
	}

	function getFiltersObj() {
		return filtersTarget
	}

	function callClickOnFilters(name,value, prop) {
		var type = filtersTarget[name]['type']
		if(type == "checkbox") {
			var array = value.split(",")
			filtersTarget[name]['selection'] = array;
			if(name == "functionalArea") {
				array.forEach(function(value){
					var obj = search(value, functionalAreaTagsData)
					filtersTarget[name]['label'].push(obj.text)
				})
			}
			if(name == "industry") {
				array.forEach(function(value){
					var obj = search(value, industryTagsData)
					filtersTarget[name]['label'].push(obj.text)
				})
			}
			if(name == "currentLocation") {
				array.forEach(function(value){
					var obj = search(value, currentLocationTagsData)
					filtersTarget[name]['label'].push(obj.text)

				})
			}
			if(name == "preferredLocation") {
				array.forEach(function(value){
					var obj = search(value, prefeLocationTagsData)
					filtersTarget[name]['label'].push(obj.text)
				})
			}
			if(name == "institute") {
				array.forEach(function(value){
					var obj = search(value, instituteTagsData)
					filtersTarget[name]['label'].push(obj.text)
					if(obj.isTop && obj.isTop == "topinst") {
						settings.topinstitute.topinst += 1
					}
					if(obj.isTop && obj.isTop == "lawinst") {
						settings.topinstitute.lawinst += 1
					}
				})
			}
			if(name == "language") {
				array.forEach(function(value){
					var obj = search(value, languageTagsData)
					filtersTarget[name]['label'].push(obj.text)
				})
			}
		}

		else if(type == "dropdownHalf"){
			for(var key in filtersTarget[name]["props"]) {
				if(prop == key)
					filtersTarget[name]["props"][key]['selection'] = value
			}
		}
		else if(type == "dropdown"){
			filtersTarget[name]['selection'] = value
			if(name == "applicationDate")
				filtersTarget[name]['label'] = applicationDateObj[value]
			if(name == "lastActive")
				filtersTarget[name]['label'] = lastActive[value]
			if(name == "permit")
				filtersTarget[name]['label'] = workPermit[value]
			if(name == "handleTeam")
				filtersTarget[name]['label'] = binary[value]
			if(name == "relocate")
				filtersTarget[name]['label'] = binary[value]
			if(name == "differentlyAbled")
				filtersTarget[name]['label'] = binary[value]
			if(name == "notice")
				filtersTarget[name]['label'] = notice[value]
			if(name == "sex")
				filtersTarget[name]['label'] = gender[value]
		}
		else if (type == "input") {
			filtersTarget[name]['selection'] = value
			filtersTarget[name]['target'].val(value)
		}
	}

	function changeSelectValue(value) {
		filtersTarget["orderBy"]["target"].val(value);
	}

    return {
    	init: init,
    	addFilterData: addFilterData,
    	getAppliedFilters: getAppliedFilters,
    	onClickApplyFilterButton: onClickApplyFilterButton,
    	setAppliedFilters: setAppliedFilters,
    	onClickRemoveFilter: onClickRemoveFilter,
    	removeFilter:removeFilter,
    	onClickSearchButton: onClickSearchButton,
		onSelectSortByOption: onSelectSortByOption,
		onClickRemoveAllFilters: onClickRemoveAllFilters,
		showResultsFound: showResultsFound,
		hideAppliedFilters:hideAppliedFilters,
		showAppliedFilters:showAppliedFilters,
		checkForError: checkForError,
		closeFilterModal: closeFilterModal,
		addFiltersToContainer: addFiltersToContainer,
		getFiltersObj: getFiltersObj,
		callClickOnFilters: callClickOnFilters,
		changeSelectValue: changeSelectValue
    }
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {

        if (myArray[i].val == nameKey) {
            return myArray[i];
        }
    }
}
