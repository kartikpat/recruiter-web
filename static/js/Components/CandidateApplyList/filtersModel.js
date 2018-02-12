function Filters(){
	var settings = {};
	var filtersTarget = {
		industry: {
			target: $(".jsIndustry") ,
			type: 'checkbox'			
		},
		functionalArea: {
			target: $(".jsFuncArea"),
			type: 'checkbox'
		}, 
		currentLocation:  {
			target: $(".jsCurLoc") ,
			type: 'checkbox'
		}, 
		preferredLocation: {
			target: $(".jsPrefLoc"),
			type: 'checkbox'
		}, 	
		functionalArea: {
			target:  $(".jsFuncArea"),
			type: 'checkbox'
		}, 
		institute: {
			target: $(".jsInstitute"),
			type: 'checkbox'
		}, 
		language: {
			target:  $(".jsLanguage"),
			type: 'checkbox'
		}
	}
	function init(){
		settings.searchInput = "";
		settings.searchButton = "";
		settings.filterButton = "";
		settings.sortButton = "";
		settings.appliedFiltersContainer = "";
		settings.resultText = "";
		settings.clearButtton = $(".clear-all-filters");
		settings.activeFilters = $(".active-filters .filter-tag");
		settings.filterModal = $(".jsFiltersModal");
		settings.filterModalCancelButton = settings.filterModal.find('.close_modal');
		settings.candidatesContainer = $('.jsCandidatesArea');
		settings.checkbox = $(".jsCheckInput.prototype");
		settings.removeFilterButtonClass = ".remove-active-filter";


		setOnClickFilters();
		setOnClickCloseFilters();
		onClickClearButton(removeAllFilters);
		onClickRemoveFilter(removeFilter)


	}

	function create(){

	}

	function onClickSearchButton(fn){
		fn()
	}

	function onClickClearButton(fn){
		settings.clearButtton.click(function(event) {
			fn()
		});
	}

	function onClickRemoveFilter(fn){
		settings.activeFilters.on('click', settings.removeFilterButtonClass, function(e){
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
		el.remove();
	}

	function addFilterData(name, data){
		if(name && ['industry', 'functionalArea', 'currentLocation', 'preferredLocation', 'institute', 'experience', 'batch', 'salary', 'age', 'gender', 'noticePeriod', 'appliedDate', 'lastSeen', 'workPermit', 'handleTeam', 'relocate', 'differentlyAbled', 'language'].indexOf(name) ==-1)
			return console.log('not a valid filter');
		console.log(name)
		console.log(filtersTarget[name])
		if(filtersTarget[name]){
			var str = ''
			data.forEach(function(aRow){
				var checkbox = settings.checkbox.clone().removeClass("prototype hidden");
				checkbox.find(".in").attr("value", aRow["val"]);
			    checkbox.find(".in").attr("id", name+"-"+aRow["val"]);
			    checkbox.find(".lab").text(aRow["text"]);
			    checkbox.find(".lab").attr("for",name+"-"+aRow["val"]);
			    str+= checkbox[0].outerHTML;
			})
			filtersTarget[name].target.html(str);
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
    	addFilterData: addFilterData
    }
}