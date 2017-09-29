
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
var postRequest = function(url,headers,data,successCallback,completeCallback,beforeSendCallback,failCallback,processData,async,scopeTest){
    $.ajax({
        method: "POST",
        url: url,
        headers: {},
        data: data,
        scopeTest: scopeTest,
        processData:processData,
        success: successCallback,
        complete: completeCallback,
        beforeSend: beforeSendCallback,
        async: async,
        contentType: false
    });
};

// var postRequest = function(url,headers,data,processData,async,scopeTest) {
//     return new Promise(function(resolve,reject) {
//      $.ajax({
//         method: "POST",
//         url: url,
//         headers: {
//             appID: null,
//             version: null,
//             empID: null,
//             token: null
//         },
//         data: data,
//         scopeTest: scopeTest,
//         processData: processData,
//         success: resolve,
//         error: reject,
//         async: async
//     });
//  });
//}

/**
 * Wrapper for ajax get request
 * @param  {String}   url                  request url
 * @param  {object}   parameters           request parameters
 * @param  {Function} callback             function to be invoked on request success
 * @param  {object}   additionalParameters reference object if any to be accessed in the callback
 */
var getRequest = function(url,parameters,callback1,callback2,callback3, additionalParameters,showError){
    var argumentsArray = Array.from(arguments);
    var fun = arguments.callee;
    var insert = true;

      $.ajax({
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
        success: callback1,
        complete: callback3,
        beforeSend: callback2
        //error: showError

    });

}
