var baseUrl = "http://13.126.92.102:8000";
var reportsTable = $(".view-reports-table");
var headingRow = $(".heading-row");

$(document).ready(function(){
	var recruiterID = localStorage.id ;
	getRequest(baseUrl+"/recruiter/"+2804+"/reports/", {
		pageNumber: 5,
        pageContent: 20
	}, populateReportsTable)

})

reportsTable.on('click', 'a', function(){
	return false;
})

reportsTable.on('click', '.data-row a', function(){

})

var populateReportsTable = function(res) {
    if(res["status"] == "success") {
        var data = res["data"];
        if(data.length > 0) {
            headingRow.removeClass("hidden");
        }
        $.each(data, function(index, anObj) {
            var $row = $("<tr>", {class : "data-row"});
            $row.append('<td class="created-date">'+ISODateToD_M_Y(anObj["createdAt"])+'</td>');
            $row.append('<td class="job-title"><a class="link-color" href="/job/'+anObj["id"]+'/candidates?status=">'+anObj["title"]+'</a></td>');
            $row.append('<td class="posted-by"><a class="link-color" href="#">'+anObj["by"]+'</a></td>');
            $row.append('<td class="posting-views">'+anObj["views"]+'</td>');
            $row.append('<td class="total-applications"><a class="link-color" href="/job/'+anObj["id"]+'/candidates?status=">'+anObj["total"]+'</a></td>');
            $row.append('<td class="shortlist"><a class="link-color" href="/job/'+anObj["id"]+'/candidates?status=1">'+anObj["shortlisted"]+'</a></td>');
            $row.append('<td class="reject"><a class="link-color" href="/job/'+anObj["id"]+'/candidates?status=2">'+anObj["rejected"]+'</a></td>');
            $row.append('<td class="save"><a class="link-color" href="/job/'+anObj["id"]+'/candidates?status=3">'+anObj["save"]+'</a></td>');
			$row.append('<td class="resume-viewed">'+anObj["save"]+'</td>');
			$row.append('<td class="resume-downloaded">'+anObj["save"]+'</td>');
			$row.append('<td class="excel-downloaded">'+anObj["save"]+'</td>');
			$row.append('<td class="recruiter-activity">'+anObj["save"]+'</td>');
			$row.append('<td class="job-status">'+anObj["save"]+'</td>');
			$row.append('<td class="premium-status">'+anObj["save"]+'</td>');
			$row.append('<td class="job-current-status">'+anObj["save"]+'</td>');
            reportsTable.append($row);
        })
    }
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
