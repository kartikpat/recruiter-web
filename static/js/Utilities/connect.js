
function connectSocial() {
    
    var accessToken;

    // var getSocialAccessFail=pubsub.subscribe('tokenSuccess', ontokenFetchfail);
    // var getSocailAccessSuccess=pubsub.subscribe('tokenfailure', ontokenFetchSuccess);

    
    // function ontokenFetchSuccess(res){
    //     accessToken=res.data.accessToken;
    // }

    // function ontokenFetchfail(res){
    //     console.log(res)
    // }


    function linkedinConnect(param,queryParam,jobId){
        if(profile.linkedin!=1){
            window.open('/auth/linkedin?page='+queryParam+'&jobId='+jobId+'',param,'scrollbars=yes,menubar=no,width=500,height=500,resizable=yes,toolbar=no,location=no,status=no')
        }
        var data={};    
        // getSocialAccess(recruiterId,data.platform);
        data.platform="linkedin";
        jobShareSocial(recruiterId,jobId,data);
    }

    function twitterConnect(param,queryParam){
        if(profile.twitter!=1){
            window.open('/auth/twitter/?page='+queryParam+'&jobId='+jobId+'',param,' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')
        }
        // getSocialAccess(recruiterId);
        var data={};    
        data.platform="twitter";
        jobShareSocial(recruiterId,jobId,data);
    }

    return{
        linkedinConnect:linkedinConnect,
        twitterConnect:twitterConnect
    }
}