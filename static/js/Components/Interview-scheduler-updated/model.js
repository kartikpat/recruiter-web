var errorResponses = {
	missingName: 'Please enter a calendar name',
    missingMessage: 'Please enter a message for F2F interview',
    missingTeleMessage: 'Please enter a message for telephonic interview',
    missingvalues:'Please select your available hours',
    missingslots:'Please select a slot',
}

var data={
    name:"geetansh",
    message:"helo",
    telephone:"bye",
    fromDate:"2018-03-10",
    toDate:"2018-03-25",
    slots:[
        {
            startTime:"6",
            endTime:"12",
            id:"6",
        },
        {
            startTime:"12",
            endTime:"23",
            id:"5",
        }
    ]
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
        settings.check_button=$("#check-button-mon"),
        settings.start_time=$('.Start-time'),
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
        settings.createCalendar=$('.formgroup'),
        settings.fullcalendar=$('#calendar'),
        settings.Calendarhours= $('.fc-day'),
        settings.Calendarbutton= $('.fc-button'),
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
        selectCreater();
        copytoall();
        time_mapper();
        fullCalendar();
        Timer();
        copyTime();
        highlighter();
    }

    function highlighter(){
          settings.createCalendar.on("click", getslots);
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
        var currentDate=moment().format("YYYY-MM-DD");
        console.log(currentDate);
          var fromDate=currentDate;
          var toDate=""; 
        if($('#radio-button-startend').prop("checked")==true){
            fromDate=$('#start_date').datepicker().val();
            console.log(fromDate);
        }
        if($("#radio-button-start").prop("checked") == true){
            fromDate=currentDate;
        }
        if($('#radio-button-tillend').prop("checked")==true){
            toDate="";
        }
        if($('#radio-button-end').prop("checked")==true){
           // debugger
          var toDate=$('#end_date').val();
          console.log(toDate);     
        }    
    
        timetable.fromDate=fromDate;
        timetable.toDate=toDate;
        $.each(settings.dayId,function(){
            settings.select_menu.find('option').prop('disabled', false); 
            var id=$(this).attr('id');
            $("#"+id+"").css("opacity","0.5");
            var checkbox=$("#"+id+ "").find(settings.checkbox).prop("checked");
            if(checkbox==true){
            $("#"+id+"").css("opacity","1");
            }
            var startvalue=$("#"+id+ "").find(settings.start_time).val();
            var endvalue=$("#"+id+ "").find(settings.end_time).val();
           
            if(parseInt(startvalue)>0 && parseInt(endvalue)>0 && checkbox==true){
             
                var slot={
                    startTime:startvalue,
                    endTime:endvalue,
                    id:id,
                };
                slots.push(slot);
            }
        });
            console.log(slots);
            var start=settings.breakStart.val();
            var end=settings.breakEnd.val();
            if(start>0 && end>0){
                slots.forEach(function(aRow){
                    if(parseInt(start)>parseInt(aRow.startTime) && parseInt(end)>parseInt(aRow.endTime)){
                        aRow.endTime=start;
                        finalslots.push(aRow);
                    }
                    else if(parseInt(start)<parseInt(aRow.startTime) && parseInt(end)>parseInt(aRow.endTime)){
                          console.log("no slot");    
                    }
                    else if(parseInt(start)<parseInt(aRow.startTime) && parseInt(end)<parseInt(aRow.endTime) && parseInt(end)>parseInt(aRow.startTime)){
                        aRow.startTime=end;
                        finalslots.push(aRow);
                    }
                    else{
                        var Nextend=aRow.endTime;
                        aRow.endTime=start;
                        var Nextstart=end;
                        finalslots.push(aRow);
                        if(Nextend!=Nextstart){
                            var Nextslot={
                                id:aRow.id,
                                startTime:Nextstart,
                                endTime:Nextend,
                                from:aRow.from,
                                to:aRow.to,
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
        settings.message.val(object["message"]);
        settings.teleMessage.val(object["telephone"]);
        var previewslots=object.slots;
        availablehours(previewslots);
        var fromDate=object.fromDate; //DD-MM-YYYY
        startDate=moment(fromDate).format("DD-MM-YYYY");
        var toDate=object.toDate;
        endDate=moment(toDate).format("DD-MM-YYYY");
        $('#startdatepicker').datepicker().datepicker('setDate', startDate);
        $('#enddatepicker').datepicker().datepicker('setDate', endDate);
        //datepicker set value
        testHighlight(fromDate,toDate,previewslots);
        settings.createCalendar.text("Update Calendar")
    }

    function availablehours(slots){
        for(var k=0;k<slots.length;k++){
            var id=slots[k].id;
            var startvalue=slots[k].startvalue;
            var endvalue=slots[k].endvalue;
            $("#"+id+ "").find(settings.start_time).val(startvalue);
            $("#"+id+ "").find(settings.end_time).val(endvalue);
            $("#"+id+ "").find(settings.checkbox).prop("checked",true);
        }       
    }

    function testHighlight(fromDate,toDate,days){
       console.log(days);
       console.log(fromDate);
       console.log(toDate);
       console.log(days.length); 
        var daySchema ={
            1: "mon",
            2: "tue",
            3: "wed",
            4: "thu",
            5: "fri",
            6: "sat"
        }
        
     $('.TimeLines').css({"text-decoration":"line-through", "opacity":"1","color":"#b0b0b0"})   
        for(var k=0;k<days.length;k++){ 
            var start=days[k].startTime;
            var end=days[k].endTime;
            var id=days[k].id;
            console.log(start);
            console.log(end);
            console.log(id);
            console.log($('.fc-'+daySchema[id]).attr("data-date"));
            var dateToMatch= moment($('.fc-'+daySchema[id]).attr("data-date")); 
            console.log(dateToMatch); 
            var fromDateMoment = moment(fromDate);
            console.log(fromDateMoment);
            var toDateMoment = moment(toDate);
            if(toDate && toDateMoment.isBefore(dateToMatch)){
            //        debugger
                    break;
            }
            if(!(fromDateMoment.isBefore(dateToMatch) ||fromDateMoment.isSame(dateToMatch)))
                continue
            console.log("here");
            for(var j=parseInt(start);j<parseInt(end); j+=1){
                $('.fc-'+daySchema[id]).find("#hours-" +j+ "").css({"text-decoration":"none" ,"opacity":"1","color":"#149075"});
            }
        }       
    }

    function selectCreater(){
        var min = 1,
            max = 24;     
        var select= settings.select_menu;
            for (var i = min; i<=max; i++){
                var option = document.createElement('option');
                if(i<12){
                option.value = i;
                option.innerHTML = i+"AM";
                }
                else  if(i==12){
                option.value = i;
                option.innerHTML = i+"PM"; 
                }
                else if(i==24){
                option.value = i;
                option.innerHTML = (i-12)+"AM"; 
                }
                else{
                option.value = i;
                option.innerHTML = (i-12)+"PM";
                }
                select.append(option.outerHTML);
            }
    }

    function copytoall(){
        settings.check_button.change(function(event){
        if (this.checked){
            settings.button.css("display","inline-block");
        }
         else{
             $("#selectAll").css("display","none");
         }
      });
    }

    function time_mapper(){
        settings.start.change(function() {
            var parent=$(this).parent().parent().attr('id');
            var start=$("#"+parent+"").find(".start")
            var end=$("#"+parent+"").find(".end");
            var k=start.val();
            if(k>0){
            var check=$("#"+parent+" .end").find('option:selected').index();
                end.val(k);
                var value=$("#"+parent+" .start option:selected").next().val();
                end.val(value);
                $("#"+parent+" .end").find('option').prop('disabled', false);
                var index = $("#"+parent+" .start").find('option:selected').index();
                $("#"+parent+" .end").not("#"+parent+" .start").find('option:lt(' + (index+1) + ')').prop('disabled', true);
            }
        })
        settings.end.change(function() {
            var parent=$(this).parent().parent().attr('id');
            console.log(parent);
            var start=$("#"+parent+"").find(".start")
            var end=$("#"+parent+"").find(".end");
            var index = $("#"+parent+" .end").find('option:selected').index();
            console.log(index);
            $("#"+parent+" .start").find('option').prop('disabled', false);
            $("#"+parent+" .start").not("#"+parent+" .end").find('option:gt(' + (index-1) + ')').prop('disabled', true);
            
        })
    }

    function copyTime(){
        settings.button.on('click', function (){
            var startvalue=settings.element1.val();
            var endvalue=settings.element2.val();
            if (settings.checkbox.hasClass('allChecked')){
                  $('input[type="checkbox"]', settings.table).prop('checked',false);
                  settings.check_button.prop('checked',true);
                  settings.select_menu.val(0);
                  settings.firstDay.find(settings.element1).val(parseInt(startvalue));
                  settings.firstDay.find(settings.element2).val(parseInt(endvalue));
            } 
            else{
                  $('input[type="checkbox"]', settings.table).prop('checked',true);
                  settings.start_time.val(settings.element1.val());
                  settings.end_time.val(settings.element2.val());
                 
            }
            settings.checkbox.toggleClass('allChecked');
            settings.select_menu.find('option').prop('disabled', false);     
            getslots();
           
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
          $(".fc-button").on("click", Timer);
          settings.prevButton.on("click",function(){
              console.log("hello");
            $('#calendar').fullCalendar('prev');
                Timer();
          })
          settings.nextButton.on("click",function(){
            $('#calendar').fullCalendar('next');
                Timer();
          })

          Timer();
    }

    function Timer(e){       
        for(i=0;i<2400;i+=100){   
            if(i<1200){
                  $('.fc-day').append('<div id="hours-'+i/100+'" class="TimeLines">'+i/100+':00 AM </div>');
            }
            else if(i==1200){
                  $('.fc-day').append('<div id="hours-'+i/100+'" class="TimeLines">'+i/100+' :00 PM </div>');
            }
            else{
                  $('.fc-day').append('<div id="hours-'+i/100+'" class="TimeLines">'+i/100+' :00 PM </div>');
              }
          }
    }

    function startdate(){
        $("#startdatepicker").datepicker({
            buttonImage: '/static/images/calender.png',
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            fielddateFormat: 'dd-mm-yy',
            altField:   '#start_date',
            altFormat: "yy-mm-dd",
            showOn: 'both',
            onSelect: function(dateText, inst) {
                var slots=getslots();
                testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);
            }   
         });
    }
    
    function enddate(){
        $("#enddatepicker").datepicker({
            buttonImage: '/static/images/calender.png',
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            fielddateFormat: 'dd-mm-yy',
            altField:   '#end_date',
            altFormat: "yy-mm-dd",
            showOn: 'both',
            onSelect: function(dateText, inst) {
                var slots=getslots();
                testHighlight(slots.fromDate,slots.toDate,slots.highlightSlots);
            } 
         });
    }

    function getDetails(){
        timetable.name= settings.name.val(),
        timetable.message=  settings.message.val(),
        timetable.telephone=settings.teleMessage.val()
        console.log(timetable);
        return timetable
    }

    function submitHandler(fn){
		$(settings.createCalendar).click(fn)
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
        eraseErrors();
		if(!(settings.name.val())){
            console.log("fail");
			settings.name.next('.error').text(errorResponses['missingName']);
            focusOnElement(settings.name);
            return false
        }
        if(!(settings.message.val())){
            settings.message.next('.error').text(errorResponses['missingMessage']);
            settings.message.addClass('error-border');
            focusOnElement(settings.message);
            return false
        }
        if(!(settings.teleMessage.val())){
            settings.teleMessage.next('.error').text(errorResponses['missingTeleMessage']);
            settings.teleMessage.addClass('error-border');
            focusOnElement(settings.teleMessage);
            return false
        }
        var status=check();
        console.log(status);
        if((status>0)){
            console.log('false');
            return false;
        }

        var status=timetable.slots;
        console.log(status);
        if(!(status.length>0)){
            settings.slots.find('.error').text(errorResponses['missingslots']);
            $('html, body').animate({
                scrollTop: (settings.slots.closest('.second-container').offset().top)
            },200);
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
            var checkbox=$("#"+id+ "").find(settings.checkbox).prop("checked");
            if(parseInt(startvalue)==0 && parseInt(endvalue)==0 && checkbox==true){
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

    return {
        init:init,
        selectCreater :selectCreater,
        copytoall:copytoall,
        copyTime:copyTime,
        time_mapper:time_mapper,
        fullCalendar:fullCalendar,
        highlighter:highlighter,
        startdate:startdate,
        enddate:enddate,
        testHighlight: testHighlight,
        submitHandler:submitHandler,
        getDetails:getDetails,
        validate:validate,
    
    }
};

