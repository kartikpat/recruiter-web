
function connectSocial() {

    var errorCode={
        409:"Can't post the same job",   
        400:"Please Retry",
        401:"user not authenticated",
        403:"",
    }

    var socialShareFail=pubsub.subscribe('socialSharefail',onSharefail);
    var socailShareSuccess=pubsub.subscribe('socialShareSuccess', onShareSuccess);

    
    function onShareSuccess(topic,res){
        console.log(res)
        toastNotify(1,"SuccessFully Posted Job");
    }

    function onSharefail(topic,res){
        if(res.status==400){
            window.open('/auth/'+res.data['platform']+'?page=/jobs&popup=yes','','scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no');
        }
        toastNotify(3,errorCode[res.status]);
    }


    function linkedinConnect(param,queryParam,jobId,recruiterId){        
        if(profile.linkedin!=1){
            window.open('/auth/linkedin?page='+queryParam+'&jobId='+jobId+'&id='+recruiterId+'',param,'scrollbars=yes,menubar=no,width=500,height=500,resizable=yes,toolbar=no,location=no,status=no')   
            return
        }
        var data={};    
        data.platform="linkedin";
        toastNotify(1,"Posting Job","loader");
        jobShareSocial(recruiterId,jobId,data);
    }

    function twitterConnect(param,queryParam,jobId,recruiterId){
        if(profile.twitter==1){
            window.open('/auth/twitter?page='+queryParam+'&jobId='+jobId+'&id='+recruiterId+'',param,' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')
            return
        }
        var data={};    
        data.platform="twitter";
        toastNotify(1,"Posting Job","loader");
        jobShareSocial(recruiterId,jobId,data);
    }

    return{
        linkedinConnect:linkedinConnect,
        twitterConnect:twitterConnect
    }
}