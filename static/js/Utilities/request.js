
/**
 * Wrapper for ajax post request
 * @param  {String} url             request url
 * @param  {object} headers         request headers
 * @param  {object} data            data to be sent
 * @param  {function} successCallback function to be executed on request success
 * @param  {function} failCallback    function to be executed on request fail
 * @param  {boolean} processData     set this to true when passing data as an object
 * @param  {boolean} async           set this to true when making synchronous request
 * @param  {object} scopeTest       reference object if any to be accessed in the callback
 */
var postRequest = function(url,headers,data,successCallback,failCallback,processData,async,scopeTest,contentType){
    if(!headers)
        headers = {};
        headers['Authorization'] = 'Bearer '+getCookie("recruiter-access-token");
    return $.ajax({
        method: "POST",
        url: url,
        headers: headers,
        data: data,
        scopeTest: scopeTest,
        processData:processData,
        success: successCallback,
        error: failCallback,
        async: async,
        contentType: contentType
    });
};

/**
 * Wrapper for ajax get request
 * @param  {String}   url                  request url
 * @param  {object}   parameters           request parameters
 * @param  {Function} callback             function to be invoked on request success
 * @param  {object}   additionalParameters reference object if any to be accessed in the callback
 */
var getRequest = function(url,parameters,successCallback,failCallback, additionalParameters,showError){
    return  $.ajax({
        method: "GET",
        url: url,
        data: parameters,
        headers: {
            appID: null,
            version: null,
            empID: null,
            token: null
        },
        additionalParameters: additionalParameters,
        success: successCallback,
        error: failCallback

    });

}
