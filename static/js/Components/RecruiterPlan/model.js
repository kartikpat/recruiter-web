function Plans(){

   var settings ={};

   function init(){
       settings.planContinue = $(".planContinue")
   }

   function onClickBuyPlan(fn) {
       settings.planContinue.click(function() {
           var planType = $(this).attr("data-planType");
           fn(planType)
       })
   }

   return {
       init: init,
       onClickBuyPlan: onClickBuyPlan
   }
}
