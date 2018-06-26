
function connectSocial() {
    function linkedinConnect(param,queryParam,jobId){
        if(profile.linkedin!=1){
            window.open('/auth/linkedin?page='+queryParam+'&jobId='+jobId+'',param,'scrollbars=yes,menubar=no,width=500,height=500,resizable=yes,toolbar=no,location=no,status=no')
            return
        }
        var data={};    
        data.platform="linkedIn"
        jobShareSocial(recruiterId,jobId,data);
    }

    function twitterConnect(param,queryParam){
        if(profile.twitter!=1){
            window.open('/auth/twitter/?page='+queryParam+'&jobId='+jobId+'',param,' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')
            return
        }
        var data={};    
         data.platform="twitter"
        jobShareSocial(recruiterId,jobId,data);
    }

    return{
        linkedinConnect:linkedinConnect,
        twitterConnect:twitterConnect
    }
}