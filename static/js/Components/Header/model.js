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
            settings.userImg = $('.user_img')
	}


    function setUserProfile(profile){

        settings.name.text(profile["name"]);
        settings.email.text(profile["email"]);
        settings.userImg.attr("src",profile["pic"]);
    }

	return {
		init: init,
		populateData: setUserProfile
	}
}
