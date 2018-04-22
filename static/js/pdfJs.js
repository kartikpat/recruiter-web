function getBinaryData (url,callback, failCallback) {
    // body...
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        //binary form of ajax response,
        callback(e.currentTarget.response);
    };

    xhr.onerror = function  () {
        // body...
        failCallback()
    }

    xhr.send();
}
