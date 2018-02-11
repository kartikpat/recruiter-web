function Filters(){
	var settings = {};
	function init(){
		settings.searchInput = "";
		settings.searchButton = "";
		settings.filterButton = "";
		settings.sortButton = "";
		settings.appliedFiltersContainer = "";
		settings.resultText = "";
		settings.clearButtton = "";
		settings.filterModal = $(".jsFiltersModal");
		settings.filterModalCancelButton = settings.filterModal.find('.close_modal');
		settings.candidatesContainer = $('.jsCandidatesArea');


		setOnClickFilters();
		setOnClickCloseFilters();

	}

	function create(){

	}

	function onClickSearchButton(fn){
		fn()
	}

	function onClickClearButton(){

	}

	function removeAllFilters(){

	}

	function onClickFilterButton(){

	}
	function onClickSortButton(){

	}
	function removeFilter(){

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
    	init: init
    }
}