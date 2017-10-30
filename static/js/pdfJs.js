function getBinaryData (url,callback) {
    // body...
    var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function(e) {
    //     if (this.readyState == 4 && this.status == 200) {
    //         callback(e.currentTarget.response);
    //     }
    // }
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        //binary form of ajax response,
        callback(e.currentTarget.response);
    };

    xhr.onerror = function  () {
        // body...
        alert("xhr error");
    }

    xhr.send();
}
