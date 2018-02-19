function Filters(){
	var settings = {};
	var filtersTarget = {
		industry: {
			target: $(".jsIndustry") ,
			type: 'checkbox',
			selection: []
		},
		functionalArea: {
			target: $(".jsFuncArea"),
			type: 'checkbox',
			selection: []
		},
		currentLocation:  {
			target: $(".jsCurLoc") ,
			type: 'checkbox',
			selection: []
		},
		preferredLocation: {
			target: $(".jsPrefLoc"),
			type: 'checkbox',
			selection: []
		},
		institute: {
			target: $(".jsInstitute"),
			type: 'checkbox',
			selection: []
		},
		language: {
			target:  $(".jsLanguage"),
			type: 'checkbox',
			selection: []
		},
		experience: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minExp"),
					selection: null
				},
				max: {
					target: $("#maxExp"),
					selection: null
				}
			}
		},
		batch: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minBatch"),
					selection: null
				},
				max: {
					target: $("#maxBatch"),
					selection: null
				}
			}
		},
		salary: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minSal"),
					selection: null
				},
				max: {
					target: $("#maxSal"),
					selection: null
				}
			}
		},
		age: {
			type: 'dropdownHalf',
			props: {
				min: {
					target: $("#minAge"),
					selection: null
				},
				max: {
					target: $("#maxAge"),
					selection: null
				}
			}
		},
		sex : {
			target: $("#gender"),
			type: 'dropdown',
			selection: null
		},
		notice: {
			target: $("#noticePeriod"),
			type: 'dropdown',
			selection: null
		},
		applicationDate : {
			target: $("#applicationDate"),
			type: 'dropdown',
			selection: null
		},
		lastActive: {
			target: $("#lastSeen"),
			type: 'dropdown',
			selection: null
		},
		permit: {
			target: $("#workPermit"),
			type: 'dropdown',
			selection: null
		},
		handleTeam: {
			target: $("#handleTeam"),
			type: 'dropdown',
			selection: null
		},
		relocate: {
			target: $("#relocate"),
			type: 'dropdown',
			selection: null
		},
		differentlyAbled: {
			target: $("#differentlyAbled"),
			type: 'dropdown',
			selection: null
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
		settings.appliedFiltersContainer = $(".active-filters .clear-all-filters");
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


		setOnClickFilters();
		setOnClickCloseFilters();
		onInputSearchFilter()

	}

	function onClickApplyFilterButton(fn){
		settings.applyFilterButton.click(function(e){
			settings.clearAllFitersButton.removeClass("hidden")
			removeBodyFixed();
            settings.filterModal.addClass("hidden");
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
		settings.searchButton.click(function(event){
			var str = filtersTarget["searchString"]["target"].val();
			filtersTarget["searchString"]["selection"] = str;
			fn();
		})

		filtersTarget["searchString"]["target"].keyup(function(event){
            if (event.which == 13) {
				var str = filtersTarget["searchString"]["target"].val();
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
			var str = $(this).val();
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
		console.log(aFilter)

		return aFilter;
	}



	function addFilterToContainer(value, label, category, type){
		if(["dropdown","dropdownHalf"].indexOf(type) != -1) {
			var elem = settings.appliedFiltersContainer.find(".filterPill[data-category="+category+"]")
			if(elem.length) {

				$(elem).attr("data-value", value);
				$(elem).find('.icon-label').text(category + ": " + label)
				return
			}
		}
		if(type == "checkbox"){
			var elArr = settings.appliedFiltersContainer.find(".filterPill[data-category="+category+"]")
			$.each(elArr, function(index, el){
				if(filtersTarget[category]["selection"].indexOf($(el).attr("data-value")) == -1){
					el.remove()
					return
				}
			})
			var val = settings.appliedFiltersContainer.find(".filterPill[data-category="+category+"][data-value="+value+"]")
			if(val.length) {
				return
			}
		}
		var aFilter = createPill(value, label, category, type);
		settings.appliedFiltersContainer.prepend(aFilter);
	}



	function removeAllFilters(){

		for (var key in filtersTarget) {

			if(filtersTarget[key]["type"] == "checkbox") {

				filtersTarget[key]["selection"] = [];
				filtersTarget[key]['target'].find('input').prop('checked', false)
			}
			else if(filtersTarget[key]["type"] == "dropdownHalf") {
				
				for (var k in filtersTarget[key]["props"]) {
					filtersTarget[key]["props"][k]["selection"] = null;
					
					filtersTarget[key]["props"][k]['target'].val("-1")
				}
			}
			else if(filtersTarget[key]["type"] == "dropdown") {

				if(key == "orderBy") {

					continue
				}
				filtersTarget[key]["selection"] = null;
				filtersTarget[key]['target'].val("-1")
			}
		}

		settings.activeFiltersContainer.find(".filter-tag").remove();
		$("#clear-all").addClass("hidden")
	}

	function removeFilter(value,category,type) {
		if(type == "checkbox"){
			var index = filtersTarget[category]['selection'].indexOf(value)
			if(index > -1){
				filtersTarget[category]['selection'].splice(index, 1);
				filtersTarget[category]['target'].find('input[value='+value+']').prop('checked', false)
			}
		}
		else if(type == "dropdownHalf"){
			var temp = category.split("-");
			var key = temp[0];
			var category = temp[1];
			var str = filtersTarget[category]["props"][key]['selection'];
			if(str){
				filtersTarget[category]["props"][key]['selection'] = null;
				filtersTarget[category]["props"][key]['target'].val("-1")
			}
		}
		else if(type == "dropdown"){
			var str = filtersTarget[category]['selection']
			if(str){
				filtersTarget[category]['selection'] = null;
				filtersTarget[category]['target'].val("-1")
			}
		}
		if(!settings.activeFiltersContainer.find(".filter-tag").length) {
			settings.clearAllFitersButton.addClass("hidden");
		}
	}

	function setAppliedFilters(name){
		var type = filtersTarget[name]['type']
		if(type == "checkbox"){
			filtersTarget[name]['selection'] = [];
			filtersTarget[name]['target'].find('input:checked').each(function(index, el){
				var value = el.value;
				var category = name;
				var label = $(el).attr('data-label');
				filtersTarget[name]['selection'].push(el.value)
				addFilterToContainer(value, label, category, type);
			})
		}
		else if(type == "dropdownHalf"){
			for(var key in filtersTarget[name]["props"]) {
				var value = filtersTarget[name]["props"][key]['target'].val();
				var category = key +"-"+ name;
				var elem = settings.appliedFiltersContainer.find(".filterPill[data-category="+category+"]")
				;
				if(parseInt(value) == -1) {
					if(!elem.length)
						return
					filtersTarget[name]["props"][key]['selection'] = null;
					elem.remove();
					return
				}
				filtersTarget[name]["props"][key]['selection'] = value
				var label = value;
				addFilterToContainer(value, label, category, type);
			}
		}
		else if(type == "dropdown"){
			var value = filtersTarget[name]['target'].val();
			var category = name
			var elem = settings.appliedFiltersContainer.find(".filterPill[data-category="+category+"]")
			if(parseInt(value) == -1 && elem.length) {
				filtersTarget[category]['selection'] = null;
				elem.remove();
				return
			}
			filtersTarget[name]['selection'] = value
			var label = filtersTarget[name]['target'].find('option:selected').text();
			addFilterToContainer(value, label, category, type);
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
		if(filtersTarget.experience.props.min.selection)
			ob.minExp = filtersTarget.experience.props.min.selection
		if(filtersTarget.experience.props.max.selection)
			ob.maxExp = filtersTarget.experience.props.max.selection
		if(filtersTarget.salary.props.min.selection)
			ob.minCtc = filtersTarget.salary.props.min.selection
		if(filtersTarget.salary.props.max.selection)
			ob.maxCtc = filtersTarget.salary.props.max.selection
		if(filtersTarget.age.props.min.selection)
			ob.minAge = filtersTarget.age.props.min.selection
		if(filtersTarget.age.props.max.selection)
			ob.maxAge = filtersTarget.age.props.max.selection
		if(filtersTarget.batch.props.min.selection)
			ob.minAge = filtersTarget.batch.props.min.selection
		if(filtersTarget.batch.props.max.selection)
			ob.maxAge = filtersTarget.batch.props.max.selection
		if(filtersTarget.sex.selection)
			ob.sex = filtersTarget.sex.selection
		if(filtersTarget.notice.selection)
			ob.notice = filtersTarget.notice.selection
		if(filtersTarget.applicationDate.selection)
			ob.applicationDate = filtersTarget.applicationDate.selection
		if(filtersTarget.lastActive.selection)
			ob.lastActive = filtersTarget.lastActive.selection
		if(filtersTarget.permit.selection)
			ob.permit = filtersTarget.permit.selection
		if(filtersTarget.handleTeam.selection)
			ob.handleTeam = filtersTarget.handleTeam.selection
		if(filtersTarget.relocate.selection)
			ob.relocate = filtersTarget.relocate.selection
		if(filtersTarget.differentlyAbled.selection)
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
			console.log("input[value='"+obj["val"]+"']")
			filtersTarget[name].target.find("input[value='"+obj["val"]+"']").closest('.jsCheckInput').removeClass("hidden")
		})
	}

	function showResultsFound(totalFound) {
		if(filtersTarget["searchString"]["selection"]) {
			settings.resultFoundText.text(totalFound + " results found for " + filtersTarget["searchString"]["selection"]).removeClass("hidden");
			return
		}
		settings.resultFoundText.addClass("hidden")
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
		showResultsFound: showResultsFound
    }


}
