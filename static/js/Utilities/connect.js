
function connectSocial() {
    
    var accessToken;
    var socialShareFail=pubsub.subscribe('socialSharefail',onSharefail);
    var socailShareSuccess=pubsub.subscribe('socialShareSuccess', onShareSuccess);

    
    function onShareSuccess(res){
        toastNotify(1,"SuccessFully Posted Job");
    }

    function onSharefail(res){
        toastNotify(3,"error");
    }


    function linkedinConnect(param,queryParam,jobId){
        if(profile.linkedin!=1){
            window.open('/auth/linkedin?page='+queryParam+'&jobId='+jobId+'',param,'scrollbars=yes,menubar=no,width=500,height=500,resizable=yes,toolbar=no,location=no,status=no')
        }
        var data={};    
        data.platform="linkedin";
        toastNotify(1,"Posting...... Job","loader");
        jobShareSocial(recruiterId,jobId,data);
    }

    function twitterConnect(param,queryParam){
        if(profile.twitter!=1){
            window.open('/auth/twitter/?page='+queryParam+'&jobId='+jobId+'',param,' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')
        }
        var data={};    
        data.platform="twitter";
        toastNotify(1,"Posting...... Job");
        jobShareSocial(recruiterId,jobId,data);
    }

    return{
        linkedinConnect:linkedinConnect,
        twitterConnect:twitterConnect
    }
}