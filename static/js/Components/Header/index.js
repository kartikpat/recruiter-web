
$(document).ready(function(){
	var headerDetails = Header();
	headerDetails.init();

	// headerDetails.populateData(profile);
	headerDetails.myJobsView();
	headerDetails.dashboardView();
	headerDetails.searchView();
	headerDetails.navigationView();

	headerDetails.search();
})
