
function connectSocial() {
    function linkedinConnect(param,queryParam,jobId){
        window.open('/auth/linkedin?page='+queryParam+'&jobId='+jobId+'',param,'scrollbars=yes,menubar=no,width=500,height=500,resizable=yes,toolbar=no,location=no,status=no')
    }

    function twitterConnect(param,queryParam){
        window.open('/auth/twitter/?page='+queryParam+'&jobId='+jobId+'',param,' scrollbars=yes,menubar=no,width=500,height=500, resizable=yes,toolbar=no,location=no,status=no')
    }

    return{
        linkedinConnect:linkedinConnect,
        twitterConnect:twitterConnect
    }
}