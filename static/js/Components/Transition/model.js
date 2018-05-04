$(document).ready(function(){

    setInterval(function() {
    	if($("#login").css('display')=='none'){
			$("#wait").addClass("fadeOut");
			$("#login").removeClass('fadeOut')
        	$('#wait').addClass('hidden');
        	$("#login").removeClass('hidden')
        	return
    	}
        $("#login").addClass("fadeOut");
        $("#wait").removeClass('fadeOut')
        $('#login').addClass('hidden');
        $("#wait").removeClass('hidden')
      },2000);
   
});