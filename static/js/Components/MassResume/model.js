
// var res = [
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 2,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 2,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 2,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 1,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 10,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 2,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 2,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 2,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 2,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   },
//   {
//      "date":"2012-07-14T01:00:00+01:00"
//     ,"requestId": "WVadlg==",
//     "status": "Request completed Download link sent on mail.",
//     "downloads": 0,
//     "count": 1,
//     "expiry": "2012-07-14T01:00:00+01:00",
//     "downloadLink": "https://www.iimjobs.com/masscount/WVadlg==/WlqbmrE="
//   }
// ]


function MassResume(){
    var settings={};
    function init(){
        settings.tableRow=$(".row.prototype");
        settings.date=('.date');
        settings.resumeContent=	$('.mass-resume-content');
        settings.massResumeShell = $(".massResume.shell")
        settings.emptyView=$('.empty-view'),
        settings.header=$('.mass-resume-header')      
        // addToList(res);
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
          item.requestId.text(aResume["id"]);
          item.Status.text(aResume["status"]);
            var noOfDownloads;
            if(aResume["downloadCount"] == 0) {
                noOfDownloads = "No Downloaded";
            }
            else {
                noOfDownloads = "No. Of Downloads: " +aResume["downloadCount"];
            }
          item.noOfDownloads.text(noOfDownloads);
          item.count.text(aResume["resumeCount"]);
          var str=encodeURI(aResume['id']);
          var aResumeLink=baseUrl+"/bulk/"+str+"/"+aResume["path"];
          item.downloadLink.html("<div>Expires On: "+ISODateToD_M_Y(aResume["expiry"]) + "  " + ISODateToTime(aResume["expiry"])+"</div><div class='download-link'><a href="+aResumeLink+">Click Here</a> to download</div>");
          return item
    }

    function showShells() {
        settings.massResumeShell.removeClass("hidden");
    }

    function hideShells() {
        settings.massResumeShell.addClass("hidden");
    }

    function addToList(dataArray){
        console.log(dataArray)
      var str = '';
      if(dataArray.data.length==0){
           settings.emptyView.removeClass('hidden');
           settings.header.addClass('hidden');
      }
      dataArray.data.forEach(function(aData){
          var item = populateResumeStatus(aData);
          str+=item.element[0].outerHTML;
      });
      hideShells();
      $('.mass-resume-content').append(str);

      if(dataArray.length< pageContent) {
          if($('.mass-resume-content').find(".no-more-records").length == 0) {
              return $('.mass-resume-content').append("<div class='no-more-records no-data'>You have reached the end of the list</div>")
          }
      }
    }

    return{
        init:init,
        populateResumeStatus:populateResumeStatus,
        getElement:getElement,
        showShells: showShells,
        hideShells: hideShells,
        addToList:addToList
    }

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
