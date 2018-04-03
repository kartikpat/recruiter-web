
var res = [
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 1,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 10,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 2,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  },
  {
     "date":"2012-07-14T01:00:00+01:00"
    ,"requestId": "WVadlg==",
    "status": "Request completed Download link sent on mail.",
    "downloads": 0,
    "count": 1,
    "expiry": "2012-07-14T01:00:00+01:00",
    "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
  }
]


function MassResume(){
    var settings={};
    function init(){
        settings.tableRow=$(".row.prototype");
        settings.date=('.date');
        settings.requestId=('.request-id');
        settings.Status=('.status');
        settings.count=('.resumes');
        settings.downloadLink=('.download-link')
        settings.resumeContent=	$('.mass-resume-content')
        settings.noOfDownloads=(".downloaded")
        populateResumeStatus(res);
    }

    function populateResumeStatus(res){
        res.forEach(function(aResume){
        var card = settings.tableRow.clone().removeClass('prototype hidden');
        card.find(settings.date).text(ISODateToD_M_Y(aResume["date"]));
        card.find(settings.requestId).text(aResume["requestId"]);
        card.find(settings.Status).text(aResume["status"]);
              var noOfDownloads;
              if(aResume["downloads"] == 0) {
                  noOfDownloads = "No Downloaded";
              }
              else {
                  noOfDownloads = "No. Of Downloads: " +aResume["downloads"];
              }
        card.find(settings.noOfDownloads).text(noOfDownloads);
              card.find(settings.count).text(aResume["count"]);
        card.find(settings.downloadLink).html("<div>Expires On: "+ISODateToD_M_Y(aResume["expiry"]) + "  " + ISODateToTime(aResume["expiry"])+"</div><div class='download-link'><a href="+aResume["downloadLink"]+" class='link-color  download-resume-link'>Click Here</a> to download</div>");

        settings.resumeContent.append(card);
      })

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

    // function addToList(dataArray){
    //   var str = '';
    //   if(dataArray.length==0){
    //        settings.emptyView.removeClass('hidden');
    //        settings.header.addClass('hidden');
    //   }
      
    //   dataArray.forEach(function(aData, index){
    //       var item = createElement(aData);
    //       str+=item.element[0].outerHTML;
    //   });
    //   hideShells();
    //   settings.reportsTable.append(str);
    // }

    return{
        init:init,
        checkTime:checkTime,
        ISODateToTime:ISODateToTime,
        ISODateToD_M_Y:ISODateToD_M_Y,
        populateResumeStatus:populateResumeStatus
    }
    
}





