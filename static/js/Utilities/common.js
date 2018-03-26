function Set_Cookie( name, value, expires, path, domain, secure ){
	// set time, it's in milliseconds
	var today = new Date();
	today.setTime( today.getTime() );

	/*
	if the expires variable is set, make the correct
	expires time, the current script below will set
	it for x number of days, to make it for hours,
	delete * 24, for minutes, delete * 60 * 24
	*/
	if ( expires )
	{
	expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );

	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
	( ( path ) ? ";path=" + path : "" ) +
	( ( domain ) ? ";domain=" + domain : "" ) +
	( ( secure ) ? ";secure" : "" );
}

function isValidEmail(emailAddress) {
    var pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return pattern.test(emailAddress);
};
function isValidPhone(val) {
	if (/^\d{10}$/.test(val)) {
	    return true;
	} else {
    return false
	}
}

function checkCharacters(val, len) {
	if(val < len)
		return false
	return true
}

function ifBothMatches(one, two){
	if(one != two)
		return false;
	return true;
}

function fetchURL(){
       var obj = {}
       for(var key in window["location"]){
               if(typeof(window["location"][key])=="string"){
                       obj[key]= window["location"][key];
               }
       }
       return obj;
}

function getQueryParameter(queryString) {

	var urlObj = fetchURL();
	console.log(urlObj["search"])
	var testString = urlObj["search"];
	var obj = {};
	if(!testString) {
		return obj
	}
    testString= testString.replace("?", "");
    testString= testString.split("&");


	for(var i=0; i < testString.length; i++){
        var temp=testString[i].split("=");
	    obj[temp[0]] = temp[1]
   	}

    if(!queryString) {
	    return obj
    }

    if(obj[queryString]) {
        return obj[queryString];
    }
}

function getMonthName(month){
	if(!month || month > 12) {
		return ""
	}
	var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
                        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
	return monthNames[(month - 1)];
}

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function addBodyFixed() {
	jQuery("body").addClass("posf");
}

function removeBodyFixed(){
	jQuery("body").removeClass("posf");
}

// Sample link
// <a href="https://www.facebook.com/sharer/sharer.php?u=" target="_blank">Share</a>

function getFacebookShareLink(url){
	return "https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url);
}

function getTwitterShareLink(url){
	return "https://twitter.com/share?url="+encodeURIComponent(url);
	// "http://twitter.com/share?text=text goes here&url=http://url goes here&hashtags=hashtag1,hashtag2,hashtag3"
}

function getLinkedInShareUrl(url){
	return "https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(url)

	// TO create a link with all parameters
	// "https://www.linkedin.com/shareArticle?mini=true&url=<?php the_permalink(); ?>&title=Some%20Title&summary=Some%20Summary&source=YourWebsiteName"
}
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
function formatSalary(salary){
	if(salary =='confidential')
		return "Confidential";
	return salary+" LPA"
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}
