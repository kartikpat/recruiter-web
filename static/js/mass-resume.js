var tableRow = $(".row.prototype");

var res = [
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 1,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 10,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"request-id": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 0,
    "resumes": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "download_link": "https://www.iimjobs.com/massresumes/WVadlg==/WlqbmrE="
  }
]



$(document).ready(function(){

    //getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateProfile);
    populateResumeStatus(res);
});



var populateResumeStatus = function(res) {
	// console.log(res);
	// if(res.status=="success"){
		//	res["data"].sort(compare);
		res.forEach(function(aResume){
			var card = tableRow.clone().removeClass('prototype hidden');

			card.find(".date").text(ISODateToD_M_Y(aResume["date"]));
			card.find(".request-id").text(aResume["request-id"]);
			card.find(".status").text(aResume["status"]);
            var noOfDownloads;
            if(aResume["downloads"] == 0) {
                noOfDownloads = "No Downloaded";
            }
            else {
                noOfDownloads = "No. Of Downloads: " +aResume["downloads"];
            }
			card.find(".downloaded").text(noOfDownloads);
            card.find(".resumes").text(aResume["resumes"]);
			card.find(".download-link").html("<div>Expires On: "+ISODateToD_M_Y(aResume["expiry"]) + "  " + ISODateToTime(aResume["expiry"])+"</div><div class='download-link'><a href="+aResume["download_link"]+" class='link-color  download-resume-link'>Click Here</a> to download</div>");

			$('.mass-resume-content').append(card);
		})
	//}
}

function checkTime(i) {
 if (i < 10) {
   i = "0" + i;
 }
 return i;
}

function ISODateToTime(aDate) {
  var date = new Date(aDate),
	hours = date.getHours(),
	mins = date.getMinutes();
    mins = checkTime(mins);
      var str = hours + ":" + mins;
      return str;
}

function ISODateToD_M_Y(aDate) {
  var date = new Date(aDate),
	year = date.getFullYear(),
	month = date.getMonth(),
	dt = date.getDate();

  if (dt < 10) {
	dt = '0' + dt;
  }
  if (month < 10) {
	month = '0' + month;
  }

  var str = dt + "-" + month + "-" + year;
  return str;
}
