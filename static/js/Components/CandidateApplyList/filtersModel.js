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
		functionalArea: {
			target:  $(".jsFuncArea"),
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
		minExp: {
			target: "",
			type: 'dropdown',
			selection: null
		},
		maxExp : {
			target: "",
			type: 'dropdown',
			selection: null
		},
		minCtc : {
			target: "",
			type: 'dropdown',
			selection: null
		},
		maxCtc: {
			target: "",
			type: 'dropdown',
			selection: null
		},
		minAge: {
			target: "",
			type: 'dropdown',
			selection: null
		},
		maxAge: {
			target: "",
			type: 'dropdown',
			selection: null
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
			type: 'dropdown',
			selection: null
		},
		handleTeam: {
			target: "",
			type: 'dropdown',
			selection: null
		},
		relocate: {
			target: "",
			type: 'dropdown',
			selection: null
		},
		differentlyAbled: {
			target: "",
			type: 'dropdown',
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
		settings.candidatesContainer = $('.jsCandidatesArea');
		settings.checkbox = $(".jsCheckInput.prototype");
		settings.removeFilterButtonClass = ".remove-active-filter";
		settings.applyFilterButton = $(".applyFilterButton");
		settings.activeFilterListingClass = ".activeFilterListing";
		settings.filterPill = $(".prototype.filterPill")


		setOnClickFilters();
		setOnClickCloseFilters();
		onClickClearButton(removeAllFilters);
		onClickRemoveFilter(removeFilter)
		// onClickApplyFilterButton(setAppliedFilters)


	}

	function createPill(value, label, category){
		var aFilter = settings.filterPill.clone().removeClass('hidden prototype');
		aFilter.attr('data-category', category)
		aFilter.attr('data-value', value);
		aFilter.find('.icon-label').text(label)
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

	function addFilterToContainer(value, label, category){
		
		var aFilter = createPill(value, label, category);
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
		var index = filtersTarget[category]['selection'].indexOf(value)
		console.log(filtersTarget)
		if(index > -1){
			debugger
			filtersTarget[category]['selection'].splice(index, 1);
			el.remove();
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
		if(filtersTarget[name]['type'] == "checkbox"){
			filtersTarget[name]['selection'] = [];
			filtersTarget[name]['target'].find('input:checked').each(function(index, el){
				var value = el.value;
				var category = name;
				var label = $(el).attr('data-label');
				filtersTarget[name]['selection'].push(el.value)
				addFilterToContainer(value, label, category);
			})
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

		if(filtersTarget.minExp.selection)
			ob.minExp = filtersTarget.minExp.selection
		if(filtersTarget.maxExp.selection)
			ob.maxExp = filtersTarget.maxExp.selection
		if(filtersTarget.minCtc.selection)
			ob.minCtc = filtersTarget.minCtc.selection
		if(filtersTarget.maxCtc.selection)
			ob.maxCtc = filtersTarget.maxCtc.selection
		if(filtersTarget.minAge.selection)
			ob.minAge = filtersTarget.minAge.selection
		if(filtersTarget.maxAge.selection)
			ob.maxAge = filtersTarget.maxAge.selection
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
		if(filtersTarget.language.selection)
			ob.language = filtersTarget.language.selection
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