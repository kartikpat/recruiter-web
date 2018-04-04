
$(document).ready(function(){
	var headerDetails = Header();
	headerDetails.init();

	// headerDetails.populateData(profile);
	headerDetails.myJobsView();
	headerDetails.myInterviewView();
	headerDetails.dashboardView();
	headerDetails.searchView();
	headerDetails.navigationView();
	headerDetails.search();
	console.log(profile)
	headerDetails.resumeModal(profile);
	// headerDetails.CloseresumeModal();
})
