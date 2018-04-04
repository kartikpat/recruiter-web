
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
            window.location='/settings'
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

    return{
        init:init,
        connect:connect
    }

}