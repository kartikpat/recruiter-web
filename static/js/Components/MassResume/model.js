
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
        settings.resumeContent=	$('.mass-resume-content')
        addToList(res);
    }

    function getElement() {
      var card = settings.tableRow.clone().removeClass('prototype hidden');
      return {
          element: card,
          requestId:card.find('.request-id'),
          date:card.find('.date'),
          Status:card.find('.status'),
          count:card.find('.resumes'),
          downloadLink:card.find('.download-link'),
          noOfDownloads:card.find(".downloaded")  
      }
  }

    function populateResumeStatus(aResume){
        var item=getElement();
          item.date.text(ISODateToD_M_Y(aResume["date"]));
          item.requestId.text(aResume["requestId"]);
          item.Status.text(aResume["status"]);
            var noOfDownloads;
            if(aResume["downloads"] == 0) {
                noOfDownloads = "No Downloaded";
            }
            else {
                noOfDownloads = "No. Of Downloads: " +aResume["downloads"];
            }
          item.noOfDownloads.text(noOfDownloads);
          item.count.text(aResume["count"]);
          item.downloadLink.html("<div>Expires On: "+ISODateToD_M_Y(aResume["expiry"]) + "  " + ISODateToTime(aResume["expiry"])+"</div><div class='download-link'><a href="+aResume["downloadLink"]+" class='link-color  download-resume-link'>Click Here</a> to download</div>");
          return item
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

    function addToList(dataArray){
      var str = '';
      // if(dataArray.length==0){
      //      settings.emptyView.removeClass('hidden');
      //      settings.header.addClass('hidden');
      // }
      dataArray.forEach(function(aData, index){
          var item = populateResumeStatus(aData);
          str+=item.element[0].outerHTML;
      });
      $('.mass-resume-content').append(str);
      
      if(dataArray.length< pageContent) {
        return  $('.mass-resume-content').append("<div class='no-data'>No more records!</div>")
      }
    }

    return{
        init:init,
        checkTime:checkTime,
        ISODateToTime:ISODateToTime,
        ISODateToD_M_Y:ISODateToD_M_Y,
        populateResumeStatus:populateResumeStatus,
        getElement:getElement
    }
    
}





