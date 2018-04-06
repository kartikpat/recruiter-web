function Plans(){

   var settings ={};

   function init(){
           settings.name= $('.user_name'),
           settings.platinumContinue = $(".platinumContinue"),
           settings.signatureContinue = $(".signatureContinue")
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
