var obj = {
    
    "name": "testing",
	"message": "This ia a message",
	"telephone": "Get me a call",   
}

var timeTable= [{
    name:[],
    message:[],
    telephonic:[],
    slots: [{  
        id:[],
        startTime:[],
        endtTime:[],
     }]
}]

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
        //settings.check=$('.Checked'),
        settings.dayId= $('.dayId'),
        settings.checkbox=$(''),
        settings.breakStart=$('.Break-start'),
        settings.breakEnd=$('.Break-end')
    }

    function getDetails() {
        var object ={
        name:  settings.name.val(),
        message: settings.message.val(),
        telephone: settings.telephone.val()
        }
        return object;
    }

    function getDayid(){
        settings.dayId.on('click',function(){
            var id=$(this).attr('id');
            var startvalue=$("#"+id+ "").find( settings.start_time).val();
            var endvalue=$("#"+id+ "").find( settings.end_time).val();
            var checkbox= settings.check_button.prop("checked");
        if(startvalue!=0 && endvalue!=0 && checkbox==true){    
            var slot=[{
                slots: [{
                    id: id,
                    startTime:startvalue,
                    endtTime: endvalue
                }]
            }]
            timeTable.push(slot);
            console.log(timeTable);
        }
       
        })
       return timeTable;
    }

    function getBreakhours(){

    }





    function selectCreater() {
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
                option.text = i;
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
           if(check==0){
                end.val(k);
                var value=$("#"+parent+" .Start-time option:selected").next().val();
                end.val(value);
                $("#"+parent+" .End-time").find('option').prop('disabled', false);
                var index = $("#"+parent+" .Start-time").find('option:selected').index();
                $("#"+parent+" .End-time").not("#"+parent+" .Start-time").find('option:lt(' + (index+1) + ')').prop('disabled', true);
            }
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
            console.log("hello");
            if (settings.checkbox.hasClass('allChecked')){
                  $('input[type="checkbox"]', settings.table).prop('checked',false );
            } 
            else{
                  $('input[type="checkbox"]', settings.table).prop('checked',true);
            }
            settings.checkbox.toggleClass('allChecked').not(settings.button);
            var x = settings.element1.val(); 
            var y = settings.element2.val();  
            settings.start_time.val(settings.element1.val());
            settings.end_time.val(settings.element2.val());
      
        })
    }

    return {
        init:init,
        getDetails: getDetails,
        selectCreater :selectCreater,
        copytoall:copytoall,
        copyTime:copyTime,
        time_mapper:time_mapper,
        getDayid:getDayid,

    }
};

