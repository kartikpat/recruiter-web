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
			settings.myInterviewView=$('.interview-view'),
			settings.myReportsView=$('.reports-view'),
			settings.myJobs=$('.sub-menu'),
			settings.myInterview=$('.interviews'),
			settings.myReports=$('.reports')
			settings.menucontainer=$('.menu-section'),
			settings.backbutton=$('.my-jobs-menu-back'),
			settings.searchButton=$('.search'),
			settings.navigation=$('.navigation'),
			settings.searchView=$('.search-container');
			settings.searchInput=$('.search-box');
			settings.navigationView=$('.exit-view'),
			settings.exitButton=$('.information-icon'),
			settings.searchButton=$('.search-icon'),
			settings.menuBar=$('.mobile-menu'),
			settings.globalSearch= $("#globalSearch"),
			settings.searchResume=$('.search-resume'),
			settings.CloseresumeModal=$('.modal_close');
			settings.searchAccess = 1;

			$(".recruiterLogout").click(function(){	
				document.cookie = "recruiter-access-token" + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
				window.location.href = "/login"
				return false
			})
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

	function myInterviewView(){
		settings.myInterview.on('click', function(){
			settings.menucontainer.addClass("hidden");
			settings.myInterviewView.removeClass("hidden");
		});
	}

	// function myReportsView(){
	// 	settings.myReports.on('click', function(){
	// 		settings.menucontainer.addClass("hidden");
	// 		settings.myReportsView.removeClass("hidden");
	// 	});
	// }


	function dashboardView(){
		settings.backbutton.on('click', function(){
			settings.menucontainer.removeClass("hidden");
			settings.myJobsview.addClass("hidden");
			settings.myInterviewView.addClass("hidden");
		});
	}

	function searchView(){
		settings.searchButton.on('click', function(){
			if(jQuery(window).width()<=480){
				settings.menuBar.addClass('hidden');
			}
			settings.navigation.addClass("hidden");
			settings.searchView.removeClass("hidden");
			settings.searchButton.addClass("hidden");
			settings.exitButton.removeClass("hidden");
			settings.searchInput.focus();
		});
	}
	function navigationView(){
		settings.exitButton.on('click', function(){
			if(jQuery(window).width()<=480){
				settings.menuBar.removeClass('hidden');
			}
			settings.searchInput.val('');
			settings.navigation.removeClass("hidden");
			settings.searchView.addClass("hidden");
			settings.searchButton.removeClass("hidden");
			settings.exitButton.addClass("hidden");
		});
	}

	function search() {
		settings.globalSearch.submit(function(){
			var str = settings.searchInput.val()
			console.log(str)
			window.location = "/recruiter/search?searchQuery=" + encodeURI(str)
  			return false
		});
	}

	function resumeModal(profile){
		settings.searchResume.on('click',function(){
			if(profile.search && parseInt(profile.search) == 1) {
				return window.location.href = 'https://search.iimjobs.com'
			}
			addBodyFixed()
			$('.resumeModal').removeClass('hidden');
			return false
		})
	}



	return {
		init: init,
		populateData: setUserProfile,
		myJobsView :myJobsView,
		myInterviewView:myInterviewView,
		dashboardView:dashboardView,
		searchView:searchView,
		navigationView:navigationView,
		resumeModal:resumeModal,
		search:search
	}
}
