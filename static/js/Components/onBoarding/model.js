
function onBoarding(){

    var settings={}
    function init(){
        settings.profile=$('.upload-profile'),
        settings.facebookConnect=$('.facebook'),
        settings.linkedinConnect=$('.linkedin'),
        settings.twitterConnect=$('.twitter')
    }

    function connect(){
        settings.profile.on('click',function(){
            window.location=staticEndPoints.recruiterProfile;
        })
        settings.facebookConnect.on('click',function(){
            window.open('/auth/facebook/','',' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')

        })

        settings.linkedinConnect.on('click',function(){
            window.open('/auth/linkedin/','',' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')
        })

        settings.twitterConnect.on('click',function(){
            window.open('/auth/twitter','',' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')
        })
    }

    function connected(){
        
        console.log(profile['twitter'])
        if(profile['linkedin']==1){
            settings.linkedinConnect.css('background',' #f3fbfb ');
            settings.linkedinConnect.find('.triangle').removeClass('hidden');
            settings.linkedinConnect.find('.icon-container').removeClass('hidden');
        }
        if(profile['twitter']==1){
            settings.twitterConnect.css('background',' #f3fbfb ');
            settings.twitterConnect.find('.triangle').removeClass('hidden');
            settings.twitterConnect.find('.icon-container').removeClass('hidden');
        }

        if(profile['facebook']==1){
            settings.facebookConnect.css('background',' #f3fbfb ');
            settings.facebookConnect.find('.triangle').removeClass('hidden');
            settings.facebookConnect.find('.icon-container').removeClass('hidden');
        }
        
    }


    return{
        init:init,
        connect:connect,
        connected:connected
    }

}
