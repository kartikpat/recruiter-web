var errorResponses = {
	missingName: 'Please enter a calendar name',
    missingMessage: 'Please enter a message for F2F interview',
    missingTeleMessage: 'Please enter a message for telephonic interview',
    missingvalues:'Please select your available hours',
    missingslots:'Please select a slot',
    missingDate:"Please select a end Date",
    missingStart:"Please select Start Time",
    missingEnd:"Please select End Time",
    missingDateSlot:"Please select a slot between startdate and endate"
}

  function Calendar(){
    var settings ={};
    var timetable={};

    function init(){
        settings.name= $('#name'),
        settings.message= $("#message"),
        settings.teleMessage= $("#telephonic"),
        settings.select_menu= $(".select-dropdown"),
        settings.button=$("#selectAll"),
        settings.copytoall=$(".copyToAll"),
        settings.check_button=$("#check-button-mon"),
        settings.start_time=$('.Start-time'),
        settings.end_timeClass=('.End-time'),
        settings.start_timeClass=('.Start-time'),
        settings.end_time=$('.End-time'),
        settings.copy=$('body'),
        settings.table=$('#example'),
        settings.element1= $('#selectElementId-1'),
        settings.element2= $('#selectElementId-2'),
        settings.check=$('.Checked'),
        settings.dayId= $('.dayId'),
        settings.checkbox=$('.check-button'),
        settings.breakStart=$('.Break-start'),
        settings.breakEnd=$('.Break-end'),
        settings.breakhours=$('.Breaks-available'),
        settings.fullcalendar=$('#calendar'),
        settings.Calendarhours= $('.fc-day'),
        settings.Highlighter=$('.highlighter')
        settings.startDate=$('#startdatepicker'),
        settings.endDate=$('#enddatepicker')
        settings.start=$('.start'),
        settings.end=$('.end'),
        settings.firstDay=$('#1'),
        settings.error=$('.errors'),
        settings.slots=$('.table'),
        settings.prevButton=$('.button-prev'),
        settings.nextButton=$('.button-next'),
        settings.Calendarbutton=$('.calendar-button'),
        settings.textBox=$('.field p'),
        settings.submitButton=$('#submit'),
        settings.radioInput=$('.radio-input'),
        // settings.editorMessage = new MediumEditor("#message", {
        //     toolbar: false,
        //     placeholder: false,
        // })

        // settings.editor = new MediumEditor("#telephonic", {
        //     toolbar: false,
        //     placeholder: false,
        // })

        // settings.editorMessage.subscribe('editableInput', function(event, editorElement){
        //      settings.message.val(settings.editor.getContent());
        // })
        // time_mapper();
        // selectCreater();

        copytoall();
        Timer();
        copyTime();
        // highlighter();
        selectCreater();
        startdate();
        enddate();
    }

    function highlighter(){
        //   settings.createCalendar.on("click", getslots);
          settings.Highlighter.on("change",function(e){
              e.preventDefault();
              var index=$(this).parent().parent().parent().parent().attr('id');
              console.log(index);
              timeSectionError(index);
              var slots=getslots();
              testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);
          }),
          settings.Calendarbutton.on("click",function(e){
            e.preventDefault();
            var slots=getslots();
            testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);
          });
          settings.button.on("click",function(e){
            e.preventDefault();
            var slots=getslots();
            testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);
        })
    }

    function getslots(){
        var slots=[];
        var finalslots=[];
        var date={};
        var breakhours={};
        var currentDate=moment().format("YYYY-MM-DD");

          var fromDate=currentDate;
          var toDate="";
        if($('#radio-button-startend').is(":checked")==true){
            fromDate=$('#start_date').datepicker().val();
            if(fromDate==''){
                fromDate=currentDate;
            }
        }
        if($("#radio-button-start").is(":checked") == true){
            fromDate=currentDate;
            $('#startdatepicker').datepicker('setDate', null);

        }

        if($('#radio-button-tillend').is(":checked")==true){
            toDate="0000-00-00";

            $('#enddatepicker').datepicker('setDate', null);
        }

        if($('#radio-button-end').is(":checked")==true){
            toDate=$('#end_date').datepicker().val();

        }
        date.from=fromDate;
        date.to=toDate;

        timetable.date=date;

            settings.dayId.each(function(index,el){
                var id=$(this).attr('id');
                var unique=$(this).find('.day').attr('id');
                var slotId=$(this).attr('slotId');
                $("#"+id+ "").css("opacity","0.5");
                var checkbox=$("#"+id+ "").find(settings.checkbox).is(":checked");
                if(checkbox==true){
                    $("#"+id+ "").css("opacity","1");
                }

                var startvalue=$("#"+id+ "").find(settings.start_timeClass).val();

                if(startvalue>0){
                    startTimeMapper(id)
                }

                var endvalue=$("#"+id+ "").find(settings.end_timeClass).val();
                if(endvalue>0){
                    endTimeMapper(id)
                }

                if(parseInt(startvalue,10)>0 && parseInt(endvalue,10)>0 && checkbox==true){
                    var slot={
                        day:id,
                        id:unique,
                        slotId:slotId,
                        time:{
                        from:startvalue,
                        to:endvalue,
                        }
                    };
                    slots.push(slot);
                }
            });

            var start=settings.breakStart.val();
            var end=settings.breakEnd.val();

            breakhours.from=start;
            startTimeMapper('breaks');
            breakhours.to=end;
            endTimeMapper('breaks')
            timetable.breakHours=breakhours;

            if(parseInt(start,10)>0 && parseInt(end,10)>0){
                slots.forEach(function(aRow){

                    if(parseInt(start,10)>parseInt(aRow.time.to,10)){

                        finalslots.push(aRow);
                    }
                    else if(parseInt(start,10)>parseInt(aRow.time.from,10) && parseInt(end,10)>parseInt(aRow.time.to,10)){

                        aRow.time.to=start;
                        finalslots.push(aRow);
                    }
                    else if(parseInt(start,10)<=parseInt(aRow.time.from,10) && parseInt(end,10)>=parseInt(aRow.time.to)){

                    }
                    else if(parseInt(start,10)<parseInt(aRow.time.from,10) && parseInt(end,10)<parseInt(aRow.time.to,10) && parseInt(end)>parseInt(aRow.time.from,10)){
                        aRow.time.from=end;
                        finalslots.push(aRow);
                    }
                    else if(parseInt(start,10)<parseInt(aRow.time.from,10) && parseInt(end,10)<parseInt(aRow.time.to,10)){
                        finalslots.push(aRow);
                    }
                    else{
                        var Nextend=aRow.time.to;
                        aRow.time.to=start;
                        var Nextstart=end;
                        var flag=0;
                        if(aRow.time.to!=aRow.time.from){
                            finalslots.push(aRow);
                            flag++;
                        }
                        if(Nextend!=Nextstart){
                            var Nextslot={
                                day:aRow.day,
                                // slotId:aRow.slotI,d,
                                time:{
                                from:Nextstart,
                                to:Nextend,
                                }
                            }
                            if(flag>1){
                                Nextslot.id=aRow.id;
                            }
                            finalslots.push(Nextslot);
                        }
                    }
                })
                timetable.slots=finalslots;
            }
            else{
                timetable.slots=slots;
            }
            var highlightSlots=timetable.slots;
            return{
                toDate:toDate,
                fromDate : fromDate,
                highlightSlots:highlightSlots
            }
    }

    function setDetails(object){

        settings.name.val(object["name"]);
        settings.message.val(object["message"],(/\(\d+-\d+ \w+\)$/));
        settings.teleMessage.val(object["telMessage"],(/\(\d+-\d+ \w+\)$/));
        timetable.CalendarId=object["id"];
        timetable.slots=object.slots;
		if(object.breakHours['from'])
        	settings.breakStart.val(object.breakHours['from']);
        startTimeMapper('breaks');
		if(object.breakHours['to'])
        	settings.breakEnd.val(object.breakHours['to']);
        endTimeMapper('breaks');
        var previewslots=object.slots;
        availablehours(previewslots);
        var fromDate=object.date.from; //DD-MM-YYYY
        startDate=moment(fromDate).format("DD-MM-YYYY");
        var toDate=object.date.to;
        endDate=moment(toDate).format("DD-MM-YYYY");

            $('#startdatepicker').datepicker().datepicker('setDate', startDate);
            $('#radio-button-startend').prop("checked",true)

        if(endDate!="Invalid date"){
            $('#enddatepicker').datepicker().datepicker('setDate', endDate);
            $('#radio-button-end').prop("checked",true)
        }
        // testHighlight(fromDate,toDate,previewslots);
        settings.submitButton.text("Update Calendar").attr("data-action", "update");
    }

    function availablehours(slots){
        for(var k=0;k<slots.length;k++){
            var id=slots[k].day;
            var slotId=slots[k].slotId;
            var uniqueid=slots[k].id;
            var startvalue=slots[k].time.from;
            var endvalue=slots[k].time.to;
            var checkStart=$("#"+id+ "").find(settings.start_time).val();
            var checkEnd=$("#"+id+ "").find(settings.end_time).val();
            $("#"+id+ "").css("opacity","1");
            $("#"+id+ "").attr("slotId",slotId);
            $("#"+id+ "").find('.day').attr("id",uniqueid);
            if(checkStart==0){
                $("#"+id+ "").find(settings.start_time).val(startvalue);
            }
            $("#"+id+ "").find(settings.end_time).val(endvalue);
            $("#"+id+ "").find(settings.checkbox).prop("checked","checked");
            startTimeMapper(id);
            endTimeMapper(id);
        }
    }

    function testHighlight(fromDate,toDate,days){
       fromDate=moment(fromDate).format("YYYY-MM-DD");
        var daySchema ={
            1: "mon",
            2: "tue",
            3: "wed",
            4: "thu",
            5: "fri",
            6: "sat",
            7: "sun"
        }
     $('.TimeLines').css({"text-decoration":"line-through", "opacity":"1","color":"#b0b0b0"})
        for(var k=0;k<days.length;k++){
            var start=parseInt(days[k].time.from,10);
            var end=parseInt(days[k].time.to,10);
            var id=days[k].day;
            var dateToMatch= moment($('.fc-'+daySchema[id]).attr("data-date"));
            var fromDateMoment = moment(fromDate);
            var toDateMoment = moment(toDate);
            if(toDate && toDateMoment.isBefore(dateToMatch)){
                break;
            }
            console.log(fromDateMoment)
            console.log(dateToMatch)
            console.log(!(fromDateMoment.isBefore(dateToMatch) ||fromDateMoment.isSame(dateToMatch)))
            if(!(fromDateMoment.isBefore(dateToMatch) ||fromDateMoment.isSame(dateToMatch)))
            continue
            for(var j=parseInt(start,10);j<parseInt(end,10);j+=30){
                if(j==30){
                    $('.fc-'+daySchema[id]).find("#hours-030").css({"text-decoration":"none" ,"opacity":"1","color":"#149075"});
                }
                else if(j==0){
                    $('.fc-'+daySchema[id]).find("#hours-000").css({"text-decoration":"none" ,"opacity":"1","color":"#149075"});
                }
                else
                $('.fc-'+daySchema[id]).find("#hours-"+j+"").css({"text-decoration":"none" ,"opacity":"1","color":"#149075"});

                if(!(j%100==0)){
                    j=j+40;
                }
                // j=parseInt(j);
            }
        }
    }

    function selectCreater(){
        var select= settings.select_menu;
        var ampm = 'AM';
        for (var hour=8; hour<=22; hour++) {
            var hour12 = hour > 12 ? hour - 12 : hour;
                 hour  = hour < 10 ? '0'+hour :  hour;
                 hour12= hour12 <10 ? '0'+hour12 : hour12;
            if (hour > 11) ampm = 'PM';
                for (var min = 0; min<60; min += 30) {
                     var min0= min<30 ?  '00': min;
                    select.append('<option value='+hour+min0+'>' + hour12 + ':' + min0 + ' ' + ampm +  '</option>');
                    if(hour==22){
                        break
                    }
                }
            }
    }

    function copytoall(){
        $(document).on('mouseenter', '.dayId', function() {
            $(this).find(".button-container").show().css('display','inline-block');
        }).on('mouseleave', '.dayId', function () {
            $(this).find(".button-container").hide();
        });
    }

    function startTimeMapper(parent){
        var start=$("#"+parent+"").find(".start")
        var end=$("#"+parent+"").find(".end");
        var k=parseInt(start.val(),10);
        var index = $("#"+parent+" .start").find('option:selected').index();
        if(k>=0 && index<27){
            var check=$("#"+parent+" .end").find('option:selected').index();
            $("#"+parent+" .end").find('option').prop('disabled', false);
            $("#"+parent+" .end").not("#"+parent+" .start").find('option:lt(' + (index+1) + ')').prop('disabled', true);
            $("#"+parent+" .end").find('option:first-child').prop('disabled',false);
        }
    }

    function endTimeMapper(parent){
        var start=$("#"+parent+"").find(".start")
        var end=$("#"+parent+"").find(".end");
        var index = $("#"+parent+" .end").find('option:selected').index();
        $("#"+parent+" .start").find('option').prop('disabled', false);
        $("#"+parent+" .start").not("#"+parent+" .end").find('option:gt(' + (index-1) + ')').prop('disabled', true);

    }

    function copyTime(){
        settings.copytoall.on('click', function (){
            var id=$(this).parent().parent().parent().attr("id");
            console.log(id);
            var startvalue=$("#"+id+ "").find(settings.start_time).val();
            var endvalue=$("#"+id+ "").find(settings.end_time).val();
            var checkbox=$("#"+id+ "").find(settings.checkbox).is(":checked");

            if(checkbox==true && startvalue>0 && endvalue>0){
                  $('input[type="checkbox"]', settings.table).prop('checked',true);
                  settings.start_time.val(startvalue);
                  settings.end_time.val(endvalue);
            }
            var slots=getslots();
            // testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);

        })
    }

    function fullCalendar(){
        settings.fullcalendar.fullCalendar({
            header: {
              right: 'title,prev,next',
              left:''
           },
            navLinks: false, // can click day/week names to navigate views
            businessHours: false, // display business hours
            defaultView: 'basicWeek',
            columnFormat :'ddd \n D/M/Y'
          });
          settings.prevButton.on("click",function(){
              settings.fullcalendar.fullCalendar('prev');
                Timer();
          })
          settings.nextButton.on("click",function(){
            settings.fullcalendar.fullCalendar('next');
                Timer();
          })
    }

    function Timer(e){
        var ampm = 'AM';
        for (var hour=8; hour<23; hour++){
            var hour12 = hour > 12 ? hour - 12 : hour;
            hour12= hour12 <10 ? '0'+hour12 : hour12;
            if (hour > 11) ampm = 'PM';
                for (var min = 0; min<60; min += 30) {
                     var min0= min<30 ?  '00': min;
                     $('.fc-day').append('<div id="hours-'+hour+min0+'" class="TimeLines">' + hour12 + ':' + min0 + ' ' + ampm + '</div>');
                     if(hour==22){
                        break
                    }
                }
        }

    }

    function startdate(){
        $("#startdatepicker").datepicker({
            buttonImage: "/static/images/calenderIe.png",
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd-mm-yy',
            altField:   '#start_date',
            altFormat: "yy-mm-dd",
            showOn: 'both',
            minDate: 0,
            onSelect: function(dateText, inst) {
                $('#radio-button-startend').prop("checked","true");
                var slots=getslots();
                // testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);
            }
         });
    }

    function enddate(){
        $("#enddatepicker").datepicker({
            buttonImage: "/static/images/calenderIe.png",
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd-mm-yy',
            altField:   '#end_date',
            altFormat: "yy-mm-dd",
            showOn: 'both',
            minDate: 0,
            onSelect: function(dateText, inst) {
                $('#radio-button-end').prop("checked","true");
                var slots=getslots();
                // testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);
            }
         });
    }

    function getDetails(){
        timetable.name= (settings.name.val()).trim();
         timetable.message=  (settings.message.val()).trim();

        timetable.telMessage=(settings.teleMessage.val()).trim();

        return timetable
    }

    function submitHandler(fn){
        settings.submitButton.on("click", getslots);
        settings.submitButton.click(function(){
			var action = $(this).attr("data-action")
			fn(action)
		})
       // getslots();
    }

    function timeSectionError(element){
        console.log(element);
        $("#"+element+ "").find('.error-slot').text('');
        $("#"+element+ "").find('.error').text('');
    }

    function eraseErrors(){
        settings.name.next('.error').text('');
        settings.message.next('.error').text('');
        settings.teleMessage.next('.error').text('');
        settings.name.removeClass('error-border');
        settings.message.removeClass('error-border');
        settings.teleMessage.removeClass('error-border');
    }

    function focusOnElement(element) {
        element.focus();
        element.addClass("error-border");
        $('html, body').animate({
            scrollTop: (element.closest('.form').offset().top)
        },200);
    }

    function validate(){

    	if(!((settings.name.val()).trim())){
            console.log("fail");
			settings.name.next('.error').text(errorResponses['missingName']);
            focusOnElement(settings.name);
            return false
        }
        if(!((settings.message.val()).trim())){
            settings.message.next('.error').text(errorResponses['missingMessage']);
            settings.message.addClass('error-border');
            focusOnElement(settings.message);
            return false
        }
        if(!((settings.teleMessage.val()).trim())){
            settings.teleMessage.next('.error').text(errorResponses['missingTeleMessage']);
            settings.teleMessage.addClass('error-border');
            focusOnElement(settings.teleMessage);
            return false
        }

        if($('#radio-button-end').is(":checked")==true && $('#end_date').val()==""){
            settings.radioInput.next('.error').text(errorResponses['missingDate']);
            return false;
        }

        if(parseInt(settings.breakStart.val(),10)==0 && parseInt(settings.breakEnd.val(),10)>0){
            settings.breakhours.find('.error').text(errorResponses["missingStart"]);
            $('html, body').animate({
                scrollTop: (settings.breakhours.offset().top)
            },200);
            return false
        }
        if(parseInt(settings.breakEnd.val(),10)==0 && parseInt(settings.breakStart.val(),10)>0){
            settings.breakhours.find('.error').text(errorResponses["missingEnd"]);
            $('html, body').animate({
                scrollTop: (settings.breakhours.offset().top)
            },200);
            return false
        }
        var start_date=$('#start_date').datepicker().val();
        var end_date=$('#end_date').datepicker().val();
        var start_date=moment(start_date);
        var end_date=moment(end_date);

        if(end_date.isBefore(start_date)){
            settings.radioInput.next('.error').text("End date can not be less than the current date");
            $('html, body').animate({
                scrollTop: (settings.radioInput.offset().top)
            },200);
            return false
        }
        var start=settings.breakStart.val();
        var end=settings.breakEnd.val();

		if(!end) {
			end = "0"
		}
        var status=check();

        if((status>0)){
            console.log('false');
            return false;
        }

        var status=timetable.slots;

        if(!(status.length>0)){
            settings.slots.find('.error').text(errorResponses['missingslots']);
            $('html, body').animate({
                scrollTop: (settings.slots.closest('.second-container').offset().top)
            },200);
            return false
        }

        if(slotsCheck()){
            return false
        }
		return true;
	}

    function check(){
        var flag=0;
        $.each(settings.dayId,function(){
            var id=$(this).attr('id');
            var startvalue=$("#"+id+ "").find(settings.start_time).val();
            var endvalue=$("#"+id+ "").find(settings.end_time).val();
            var checkbox=$("#"+id+ "").find(settings.checkbox).is(":checked");
            if(parseInt(startvalue,10)==0 && parseInt(endvalue,10)==0 && checkbox==true){
                $("#"+id+ "").find('.error-slot').text(errorResponses['missingvalues']);
                      $('html, body').animate({
                scrollTop: (settings.slots.closest('.second-container').offset().top)
            },200);
            flag++;
            }
        });
        return flag
    }

    function errorHandler(res){
        var message = '';
		console.log(res)
		switch(res.status){
			case 404:
				message = "";
                break;
            case 401:
				message = "";
				break;
			case 503:
				message = "";
				break;
		}
		return
    }

    function slotsCheck(){
        var fromDate = moment(timetable.date.from);
        var dowFrom = fromDate.day();
        var toDate=moment(timetable.date.to)
        var dowTo   =toDate.day();
        var fromDayOfWeek = fromDate.day();
        var toDayOfWeek = toDate.day();
        if(fromDayOfWeek==0)
            fromDayOfWeek =7;
        if(toDayOfWeek ==0)
            toDayOfWeek =7;
        var flag=0;
        if(dowTo==0){
            dowTo=7;
        }
        if(!(timetable.date.to=="0000-00-00")){
            
            var numberOfWeeks = toDate.diff(fromDate, 'weeks');
            console.log(fromDayOfWeek)
            console.log(toDayOfWeek)

            if(numberOfWeeks>0)
                return true;
            for(var k=0;k<timetable.slots.length;k++){
                var dayOfWeek = timetable.slots[k].day;
                dayOfWeek = parseInt(dayOfWeek);
                if(fromDayOfWeek > toDayOfWeek && (dayOfWeek>= fromDayOfWeek || dayOfWeek <= toDayOfWeek ) ){
                    flag++;
                }
                else if(fromDayOfWeek <= toDayOfWeek && (dayOfWeek >= fromDayOfWeek && dayOfWeek <= toDayOfWeek )){
                    flag++;
                }
                
                // if((timetable.slots[k].day<dowFrom)){
                //    if((timetable.slots[k].day<=dowTo) && dowTo<dowFrom){
                //    debugger 
                //    flag++
                //    }
                // }
                // if((timetable.slots[k].day>=dowFrom && timetable.slots[k])){
                //     debugger
                //     flag++
                // }
            }
            if(flag==0){
                settings.slots.find('.error').text(errorResponses['missingDateSlot']);
                $('html, body').animate({
                    scrollTop: (settings.slots.closest('.second-container').offset().top)
                },200);
                return true;
            }
        }   
    }


    return {
        init:init,
        selectCreater :selectCreater,
        copytoall:copytoall,
        copyTime:copyTime,
        startTimeMapper:startTimeMapper,
        endTimeMapper:endTimeMapper,
        fullCalendar:fullCalendar,
        highlighter:highlighter,
        startdate:startdate,
        enddate:enddate,
        testHighlight: testHighlight,
        submitHandler:submitHandler,
        getDetails:getDetails,
        validate:validate,
        setDetails:setDetails,
        Timer: Timer,
        copyTime: copyTime,
        slotsCheck:slotsCheck,
    }
};
