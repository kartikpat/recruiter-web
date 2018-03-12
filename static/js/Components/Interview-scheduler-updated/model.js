
function Calendar(){
    var settings ={};
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
        settings.Highlighter=$('.highlighter'),
        settings.startdate=$('#startdatepicker'),
        settings.enddate=$('#enddatepicker')
    }


    function highlighter(){
          settings.createCalendar.on("click", getslots);
          settings.Highlighter.on("change",getslots);
          settings.button.on("click",getslots);
          $(".fc-button").on("click", getslots);
         
    }

    function getslots(e){
        var timetable={ };
        var slots=[];
        var finalslots=[];
            $.each(settings.dayId,function(){
                var id=$(this).attr('id');
                var startvalue=$("#"+id+ "").find(settings.start_time).val();
                var endvalue=$("#"+id+ "").find(settings.end_time).val();
                var checkbox=$("#"+id+ "").find(settings.checkbox).prop("checked");
                timetable.name=settings.name.val();
                timetable.message=settings.message.val();
                timetable.telephone=settings.telephone.val();
                var fromDate=moment().format('ll');
                var toDate= moment(fromDate, 'll').add(5, 'days').format('ll');
                    if(startvalue!=null && endvalue!=null && checkbox==true){
                        //debugger
                        var slot={
                            startTime:startvalue,
                            endTime:endvalue,
                            id:id,
                            from:fromDate,
                            to:toDate,
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
               // console.log(slots);
            }
            highlight(timetable);
    }

    function highlight(timetable){
        var data=timetable.slots;
        $('.TimeLines').css("background-color","white");
        data.forEach(function(aRow){
              var startdate=settings.startdate.val();
              var enddate=settings.enddate.val();
           //  var startdate="";
           //  var enddate="";
            currentDate=moment(aRow.from).format('L');
            if(startdate==''){
                startdate=currentDate;
            }
            console.log(startdate);
            console.log(enddate); 
            console.log(currentDate);
        if(enddate=='' && startdate==currentDate){ //enddate null +startdate!=currentdate
            if(aRow.id=="1"){     
                  for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-mon').find("#hours-" +i+ "").css("background-color","black");
                    }
            }
            else if(aRow.id=="2"){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-tue').find("#hours-" +i+ "").css("background-color","black");
                    }
            }
            else if(aRow.id=="3"){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-wed').find("#hours-" +i+ "").css("background-color","black");
                    }  
            }
            else if(aRow.id=="4"){
                     for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-thu').find("#hours-" +i+ "").css("background-color","black");
                    }
            }
            else if(aRow.id=="5"){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-fri').find("#hours-" +i+ "").css("background-color","black");
                    }
            }
            else if(aRow.id=="6"){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-sat').find("#hours-" +i+ "").css("background-color","black");
                    }
            } 

        }
        else if(enddate=='' && startdate!=currentDate){
           
            if(aRow.id=="1"){
                var datetomatch= moment($('.fc-mon').attr("data-date")).format('L')
               console.log(datetomatch);
                var match=moment(startdate).format('L');
                console.log(typeof(match));
                console.log(datetomatch)
                console.log(startdate)
                if(match===datetomatch || datetomatch>startdate){     
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                        {
                            $('.fc-mon').find("#hours-" +i+ "").css("background-color","black");
                        }
                }
                       
            }
            else if(aRow.id=="2"){
                var datetomatch= moment($('.fc-tue').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-tue').find("#hours-" +i+ "").css("background-color","black");
                    }
                }   
            }
            else if(aRow.id=="3"){
                var datetomatch= moment($('.fc-wed').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-wed').find("#hours-" +i+ "").css("background-color","black");
                    }
                }    
            }
            else if(aRow.id=="4"){
                var datetomatch= moment($('.fc-thu').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-thu').find("#hours-" +i+ "").css("background-color","black");
                    }
                }   
            }
            else if(aRow.id=="5"){
                var datetomatch= moment($('.fc-fri').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-fri').find("#hours-" +i+ "").css("background-color","black");
                    }
                }   
            }
            else if(aRow.id=="6"){
                var datetomatch= moment($('.fc-sat').attr("data-date")).format('L')
                var match=moment(startdate).format('L');
                if(match===datetomatch || datetomatch>startdate){
                    for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                    {
                        $('.fc-sat').find("#hours-" +i+ "").css("background-color","black");
                    }
                }
            }

        }
        else{                          //end not null start not null     
            while(startdate<=enddate){
                // debugger  
                if(aRow.id=="1"){
                    var datetomatch= moment($('.fc-mon').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){     
                        for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                            {
                                $('.fc-mon').find("#hours-" +i+ "").css("background-color","black");
                            }
                    }       
                }
                else if(aRow.id=="2"){
                    var datetomatch= moment($('.fc-tue').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                        {
                            $('.fc-tue').find("#hours-" +i+ "").css("background-color","black");
                        }
                    }   
                }
                else if(aRow.id=="3"){
                    var datetomatch= moment($('.fc-wed').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                        {
                            $('.fc-wed').find("#hours-" +i+ "").css("background-color","black");
                        }
                    }    
                }
                else if(aRow.id=="4"){
                    var datetomatch= moment($('.fc-thu').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                        {
                            $('.fc-thu').find("#hours-" +i+ "").css("background-color","black");
                        }
                    }   
                }
                else if(aRow.id=="5"){
                    var datetomatch= moment($('.fc-fri').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                        {
                            $('.fc-fri').find("#hours-" +i+ "").css("background-color","black");
                        }
                    }   
                }
                else if(aRow.id=="6"){
                    var datetomatch= moment($('.fc-sat').attr("data-date")).format('L')
                    var match=moment(startdate).format('L');
                    if(match===datetomatch){
                        for(i=parseInt(aRow.startTime);i<=parseInt(aRow.endTime);i++)
                        {
                            $('.fc-sat').find("#hours-" +i+ "").css("background-color","black");
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
         // else{
           //   $("#selectAll").css("display","none");
         //}
      });
    }

    function time_mapper(){
        settings.start_time.change(function() {
            var parent=$(this).parent().parent().attr('id');
            var start=$("#"+parent+"").find(".Start-time")
            var end=$("#"+parent+"").find(".End-time");
            var k=start.val();
            var check=$("#"+parent+" .End-time").find('option:selected').index();
        //    if(check==0){
                end.val(k);
                var value=$("#"+parent+" .Start-time option:selected").next().val();
                end.val(value);
                 $("#"+parent+" .End-time").find('option').prop('disabled', false);
                var index = $("#"+parent+" .Start-time").find('option:selected').index();
                $("#"+parent+" .End-time").not("#"+parent+" .Start-time").find('option:lt(' + (index+1) + ')').prop('disabled', true);
            // }
        })

        settings.end_time.change(function() {
            var parent=$(this).parent().parent().attr('id');
            console.log(parent);
            var start=$("#"+parent+"").find(".Start-time")
            var end=$("#"+parent+"").find(".End-time");
            var index = $("#"+parent+" .End-time").find('option:selected').index();
            console.log(index);
            $("#"+parent+" .Start-time").find('option').prop('disabled', false);
            $("#"+parent+" .Start-time").not("#"+parent+" .End-time").find('option:gt(' + (index-1) + ')').prop('disabled', true);
            
        })
    }

    function copyTime(){
        settings.button.on('click', function (){
            if (settings.checkbox.hasClass('allChecked')){
                  $('input[type="checkbox"]', settings.table).prop('checked',false );
            } 
            else{
                  $('input[type="checkbox"]', settings.table).prop('checked',true);
            }
            settings.checkbox.toggleClass('allChecked').not(settings.button);
           // var x = settings.element1.val(); 
           // var y = settings.element2.val();  
            settings.start_time.val(settings.element1.val());
            settings.end_time.val(settings.element2.val());
      
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
        settings.startdate.datepicker();
    }

    function enddate(){
        settings.enddate.datepicker();  
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
    }
};

