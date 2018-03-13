

function Calendar(){
    var settings ={};
    var timetable={ };
    function init(){
        settings.name= $('#name'),
        settings.message= $("#message"),
        settings.telephone= $("#telephonic"),
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
        settings.startdate=$('#startdatepicker'),
        settings.enddate=$('#enddatepicker')
        settings.start=$('.start'),
        settings.end=$('.end'),
        settings.firstDay=$('#1')
    }

    function highlighter(){
          settings.createCalendar.on("click", getslots);
          settings.Highlighter.on("change",getslots);
       //   settings.button.on("click",copytoallslots);
          $(".fc-button").on("click", getslots);
         
    }

    function getslots(e){
        var slots=[];
        var finalslots=[];
            $.each(settings.dayId,function(){
                settings.select_menu.find('option').prop('disabled', false); 
                var id=$(this).attr('id');
                var startvalue=$("#"+id+ "").find(settings.start_time).val();
                var endvalue=$("#"+id+ "").find(settings.end_time).val();
                var checkbox=$("#"+id+ "").find(settings.checkbox).prop("checked");
                timetable.name=settings.name.val();
                timetable.message=settings.message.val();
                timetable.telephone=settings.telephone.val();
                var currentDate=moment().format('L');
                var fromDate=settings.startdate.val();
                if(fromDate==''){
                    fromDate=currentDate;
                }
                if(parseInt(startvalue)>0 && parseInt(endvalue)>0 && checkbox==true){
                    var slot={
                        startTime:startvalue,
                        endTime:endvalue,
                        id:id,
                        from:fromDate,
                        to:'',
                    };
                    slots.push(slot);
                }
            });

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
                      //  console.log('nothing');
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
                console.log(finalslots);
                timetable.slots=finalslots;
            }
            else{
                timetable.slots=slots;
            }
            highlight(timetable);
    }

    function highlight(timetable){
        var data=timetable.slots;
        console.log(timetable.slots);
        var currentDate=moment().format('L');
        var startdate=currentDate;
        var enddate='';
        $('.TimeLines').css({"text-decoration":"line-through", "opacity":"1","color":"#b0b0b0"});
        if($("#radio-button-start").prop("checked") == true){
            startdate=currentDate;
        }
        if($('#radio-button-startend').prop("checked")==true){
            startdate=settings.startdate.val();
        }
        if($('#radio-button-tillend').prop("checked")==true){
            enddate='';
        }
        if($('#radio-button-end').prop("checked")==true){
            enddate=settings.enddate.val(); 
        }
        data.forEach(function(aRow){
            console.log(startdate);
            console.log(enddate); 
            console.log(currentDate);
            console.log(aRow);
            aRow.to=enddate;
            console.log(aRow.to);
        if(enddate==''){
            if(aRow.id=="1"){
                var datetomatch= moment($('.fc-mon').attr("data-date")).format('L');
                var match=moment(startdate).format('L');
                console.log(datetomatch)
                console.log(startdate)
               
                if(match===datetomatch || datetomatch>startdate){     
                    for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                        {
                            $('.fc-mon').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                        }
                }         
            }
            else if(aRow.id=="2"){
                var datetomatch= moment($('.fc-tue').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                    {
                        $('.fc-tue').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                    }
                }   
            }
            else if(aRow.id=="3"){
                var datetomatch= moment($('.fc-wed').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                    {
                        $('.fc-wed').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                    }
                }    
            }
            else if(aRow.id=="4"){
                var datetomatch= moment($('.fc-thu').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                    {
                        $('.fc-thu').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                    }
                }   
            }
            else if(aRow.id=="5"){
                var datetomatch= moment($('.fc-fri').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                    {
                        $('.fc-fri').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                    }
                }   
            }
            else if(aRow.id=="6"){
                var datetomatch= moment($('.fc-sat').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                    {
                        $('.fc-sat').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                    }
                }
            }

        }
        else{                          //end not null start not null     
            while(startdate<=enddate){ 

                if(aRow.id=="1"){
                    var datetomatch= moment($('.fc-mon').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){     
                        for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                            {
                                $('.fc-mon').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                            }
                    }       
                }
                else if(aRow.id=="2"){
                    var datetomatch= moment($('.fc-tue').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                        {
                            $('.fc-tue').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                        }
                    }   
                }
                else if(aRow.id=="3"){
                    var datetomatch= moment($('.fc-wed').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                        {
                            $('.fc-wed').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                        }
                    }    
                }
                else if(aRow.id=="4"){
                    var datetomatch= moment($('.fc-thu').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                        {
                            $('.fc-thu').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                        }
                    }   
                }
                else if(aRow.id=="5"){
                    var datetomatch= moment($('.fc-fri').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                        {
                            $('.fc-fri').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                        }
                    }   
                }
                else if(aRow.id=="6"){
                    var datetomatch= moment($('.fc-sat').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<parseInt(aRow.endTime);i++)
                        {
                            $('.fc-sat').find("#hours-" +i+ "").css({"text-decoration":"none" , "opacity":"1","color":"#149075","font-weight": "bold"});
                        }
                    }
                }

               console.log(startdate=moment(startdate).add(1, 'days').format('L'));
            }
              
        }
        
    })
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
            var check=$("#"+parent+" .end").find('option:selected').index();
                end.val(k);
                var value=$("#"+parent+" .start option:selected").next().val();
                end.val(value);
                 $("#"+parent+" .end").find('option').prop('disabled', false);
                var index = $("#"+parent+" .start").find('option:selected').index();
                $("#"+parent+" .end").not("#"+parent+" .start").find('option:lt(' + (index+1) + ')').prop('disabled', true);
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
             // dateFormat : "D/M/Y",
              left:''
           },
            navLinks: false, // can click day/week names to navigate views
            businessHours: false, // display business hours 
            defaultView: 'basicWeek',
            columnFormat :'ddd \n D/M/Y'
          });
          $(".fc-button").on("click", Timer);
          Timer();
    }

    function Timer(e){       
        for(i=1;i<=24;i++){   
            if(i<12){
                  $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 AM </div>');
            }
            else if(i==12){
                  $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 PM </div>');
            }
            else if(i==24){
                  $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 AM </div>');
            }
            else{
                  $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 PM </div>');
              }
          }
    }

    function startdate(){
        $("#startdatepicker").datepicker({
            buttonImage: '/static/images/calender.png',
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            showOn: 'both',
            onSelect: function(dateText, inst) {
                highlight(timetable);
            }   
         });
    }
    
    function enddate(){
        $("#enddatepicker").datepicker({
            buttonImage: '/static/images/calender.png',
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            showOn: 'both',
            onSelect: function(dateText, inst) {
                highlight(timetable);
            }
         });
    }

    return {
        init:init,
        selectCreater :selectCreater,
        copytoall:copytoall,
        copyTime:copyTime,
        time_mapper:time_mapper,
        getslots:getslots,
        fullCalendar:fullCalendar,
        highlighter:highlighter,
        highlight:highlight,
        startdate:startdate,
        enddate:enddate,
        // break_timeMapper:break_timeMapper,
    }
};

