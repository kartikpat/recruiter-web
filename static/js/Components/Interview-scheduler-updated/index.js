
function clock(){
    var min = 1,
        max = 24;
     var select=$('.select-dropdown');
    
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
    $("#check-button-mon").change(function(event){
      if (this.checked){
          $("#selectAll").css("display","inline-block");
         
      }
     // else{
       //   $("#selectAll").css("display","none");
     //}
  });
}


function time_mapper(){
  $('.Start-time').change(function() {
   
    
      var parent=$(this).parent().parent().attr('id');
      var start=$("#"+parent+"").find(".Start-time")
      var end=$("#"+parent+"").find(".End-time");
      var k=start.val();
      var check=$("#"+parent+" .End-time").find('option:selected').index();
    //  console.log(check);
      if(check==0){
      end.val(k);
      var value=$("#"+parent+" .Start-time option:selected").next().val();
      end.val(value);
      $("#"+parent+" .End-time").find('option').prop('disabled', false);
      var index = $("#"+parent+" .Start-time").find('option:selected').index();
      $("#"+parent+" .End-time").not("#"+parent+" .Start-time").find('option:lt(' + (index+1) + ')').prop('disabled', true);
      }
  })
  
  $('.End-time').change(function() {
   
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

function copy_time(){
   
  $('body').on('click', '#selectAll', function (){
        
        if ($(this).hasClass('allChecked')){
            $('input[type="checkbox"]', '#example').prop('checked', false);
        } 
        else{
            $('input[type="checkbox"]', '#example').prop('checked', true);
        }
        // $(this).toggleClass('allChecked');
       
        var x = $('#selectElementId-1').val(); 
        var y = $('#selectElementId-2').val();
        
        $('.Start-time').val($('#selectElementId-1').val());
        $('.End-time').val($('#selectElementId-2').val());

  })
}

$(document).ready(clock);
$(document).ready(copy_time);
$(document).ready(copytoall);
$(document).ready(time_mapper);