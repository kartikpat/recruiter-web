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
			type: 'dropdown',
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
			type: 'dropdown',
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
			type: 'dropdown',
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
			type: 'dropdown',
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
			target: "",
			type: 'radio',
			selection: null
		},
		notice: {
			target: "",
			type: 'dropdown',
			selection: null
		},
		applicationDate : {
			target: "",
			type: 'dropdown',
			selection: null
		},
		lastActive: {
			target: "",
			type: 'dropdown',
			selection: null
		},
		permit: {
			target: "",
			type: 'radio',
			selection: null
		},
		handleTeam: {
			target: "",
			type: 'radio',
			selection: null
		},
		relocate: {
			target: "",
			type: 'radio',
			selection: null
		},
		differentlyAbled: {
			target: "",
			type: 'radio',
			selection: null
		},
		searchString: {
			target: "",
			type: 'input',
			selection: null
		}
	}
	function init(){
		settings.searchInput = $(".searchInput");
		settings.searchButton = $(".searchButton");
		settings.filterButton = "";
		settings.sortButton = "";
		settings.appliedFiltersContainer = $(".active-filters .clear-all-filters");
		settings.resultText = "";
		settings.clearButtton = $(".clear-all-filters");
		settings.activeFilters = $(".active-filters .filter-tag");
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


		setOnClickFilters();
		setOnClickCloseFilters();
		onClickClearButton(removeAllFilters);
		// onClickRemoveFilter(removeFilter)
		// onClickApplyFilterButton(setAppliedFilters)
		onChangeFilter()

	}

	function onChangeFilter() {

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

	function onClickSearchButton(fn){
		settings.searchButton.click(function(event){
			fn();
		})
	}

	function getSearchString(){
		var str = settings.searchInput.val();
		return str;
	}

	function onClickClearButton(fn){
		settings.clearButtton.click(function(event) {
			fn()
		});
	}

	function addFilterToContainer(value, label, category, type){

		var aFilter = createPill(value, label, category, type);
		settings.appliedFiltersContainer.prepend(aFilter);
	}

	function onClickRemoveFilter(fn){
		settings.activeFiltersContainer.on('click', settings.removeFilterButtonClass, function(e){
			var filterElement = $(this).closest('.filter-tag');
			fn(filterElement)
		})
	}

	function removeAllFilters(){
		settings.activeFilters.remove();
	}

	function onClickFilterButton(){

	}
	function onClickSortButton(){

	}
	function removeFilter(el){
		var value = el.attr('data-value');
		var category = el.attr('data-category');
		var type = el.attr('data-type');
		if(type == "checkbox"){
			var index = filtersTarget[category]['selection'].indexOf(value)
			if(index > -1){
				filtersTarget[category]['selection'].splice(index, 1);
				el.remove();
				filtersTarget[category]['target'].find('input[value='+value+']').prop('checked', false)
			}
		}
	}
	function onClickApplyFilterButton(fn){
		console.log('clicking apply filter')
		settings.applyFilterButton.click(function(e){
			console.log('clicking event set on applied filters');
			var name = $(settings.activeFilterListingClass).attr('data-label');
			fn(name);
		})
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
				debugger
				addFilterToContainer(value, label, category, type);
			})
			return
		}

		if(type == "dropdown"){
			for(var key in filtersTarget[name]["props"]) {
				var value = filtersTarget[name]["props"][key]['target'].val();
				if(!value) {
					return
				}
				var category = key + name;
				var label = value;
				addFilterToContainer(value, label, category, type);
			}
			return
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

	function setOnClickFilters() {
        settings.candidatesContainer.on('click','.jsFilter',function(event){
            addBodyFixed()
            settings.filterModal.removeClass("hidden");
        })
    }
    function setOnClickCloseFilters(){
    	settings.filterModalCancelButton.click(function(event){
    		removeBodyFixed();
            settings.filterModal.addClass("hidden");
    	})
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
    	getSearchString: getSearchString
    }
}
