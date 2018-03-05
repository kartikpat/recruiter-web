

    // Components/ManageCalendars/index
    var data = {"data":[{"id":155,"name":"Shreya Jain","timestamp":"2016-05-18T02:38:20.000Z","total":140,"booked":0,"nonBooked":140,"left":0},{"id":370,"name":"dsaZxasAZ","timestamp":"2016-11-15T12:46:05.000Z","total":200022,"booked":0,"nonBooked":24,"left":199998},{"id":587,"name":"ijjj","timestamp":"2017-06-19T09:32:48.000Z","total":162,"booked":0,"nonBooked":162,"left":0},{"id":595,"name":"dgfbc","timestamp":"2017-07-04T10:33:11.000Z","total":100179,"booked":0,"nonBooked":180,"left":99999},{"id":632,"name":"Testing CalCreation","timestamp":"2017-08-17T13:20:20.000Z","total":99999,"booked":0,"nonBooked":0,"left":99999},{"id":633,"name":"testing Creation","timestamp":"2017-08-18T07:32:25.000Z","total":199998,"booked":0,"nonBooked":0,"left":199998},{"id":634,"name":"testing Creation 1","timestamp":"2017-08-18T07:34:33.000Z","total":100007,"booked":0,"nonBooked":8,"left":99999},{"id":641,"name":"dsdd","timestamp":"2017-08-22T06:47:13.000Z","total":199998,"booked":0,"nonBooked":0,"left":199998}],"status":"success"}
    var calendarRows = data.data;
    calendarRows.forEach(function(aRow){
        var calendarRow = $(".calendarRow.prototype").clone().removeClass('prototype hidden');
        // TODO
        // Populate markup with the data received
        console.log(aRow);
      //  console.log(calendarRows[index].id);
        calendarRow.find(".date").text(aRow.timestamp);
        calendarRow.find(".calendar-name").text(aRow.name);
        calendarRow.find(".slots").text(aRow.nonBooked);
        // TODO
        // append calendar row into the view
        $('.schedule-container').append(calendarRow);
       
    });
   