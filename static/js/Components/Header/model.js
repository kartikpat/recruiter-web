// var errorResponses = {
// 	missingTitle: 'title cannot be blank',
// 	missingLocation: 'location cannot be blank',
// 	missingMinExp: 'minimum experience cannot be blank',
// 	missingMaxExp: 'maximum experience cannot be blank',
// 	missingDescription: 'job description cannot be blank',
// 	invalidVideoUrl: 'enter proper youtubeURL',
// 	missingIndustry: 'please choose atleast one industry',
// 	missingCategory: 'category cannot be blank',
// 	missingFunctionalArea: 'functional area cannot be blank',
// 	invalidSal: 'minimum salary cannot be greater than maximum salary',
// 	invalidBatch: 'minimum batch cannot be greater than maximum batch',
// 	invalidMinExp: 'minimum experience cannot be greater than maximum experience'
// }

function Header(){

	var settings ={};

	function init(){
			settings.name= $('.user_name'),
			settings.email = $('.user_email'),
			settings.userImg = $('.user_img'),
			settings.myJobsview =$('.MyJobs'),
			settings.myJobs=$('.sub-menu'),
			settings.menucontainer=$('.menu-section'),
			settings.backbutton=$('.my-jobs-menu-back'),
			settings.searchButton=$('.search'),
			settings.navigation=$('.navigation'),
			settings.searchView=$('.search-container');
			settings.navigationView=$('.exit-view');
	}


    function setUserProfile(profile){

        settings.name.text(profile["name"]);
        settings.email.text(profile["email"]);
        settings.userImg.attr("src",profile["pic"]);
	}

	
    function myJobsView(){
		settings.myJobs.on('click', function(){
			settings.menucontainer.addClass("hidden");
			settings.myJobsview.removeClass("hidden");
		});
	}

	function dashboardView(){
		settings.backbutton.on('click', function(){
			settings.menucontainer.removeClass("hidden");
			settings.myJobsview.addClass("hidden");
		});
	}

	function searchView(){
		settings.searchButton.on('click', function(){
			console.log("hello");
			settings.navigation.addClass("hidden");
			settings.searchView.removeClass("hidden");
		});
	}

	function navigationView(){
		settings.navigationView.on('click', function(){
			console.log("hello");
			settings.navigation.removeClass("hidden");
			settings.searchView.addClass("hidden");
		});
	}

	return {
		init: init,
		populateData: setUserProfile,
		myJobsView :myJobsView,
		dashboardView:dashboardView,
		searchView:searchView,
		navigationView:searchView,
	}
}
