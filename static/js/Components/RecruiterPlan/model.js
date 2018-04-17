function Plans() {

   var settings = {};

   function init(){
       settings.planContinue = $(".planContinue");
       settings.signatureBuy = $("#signature-buy");
       settings.platinumBuy = $("#platinum-buy");
   }

   function onClickSignatureBuy(fn) {
       settings.signatureBuy.click(function(e){
           e.stopPropagation()
           openSignatureModal()
       });
   }

   function onClickPlatinumBuy(fn) {
       settings.platinumBuy.click(function(e){
           e.stopPropagation()
           openPlatinumModal()
       });
   }

   function onClickBuyPlan(fn) {
       settings.planContinue.click(function() {
           var planType = $(this).attr("data-planType");
           fn(planType)
       })
   }

   function openModal(type) {
       if(type == "signature") {
           addBodyFixed()
           settings.jobRefreshModal.removeClass("hidden")
           return
       }
       if(type == "platinum") {
           addBodyFixed()
           settings.jobUnpublishModal.removeClass("hidden")
           return
       }
       addBodyFixed()
       settings.jobMakePremiumModal.removeClass("hidden")

   }

//    function spinner(element){

//    }

//    function hideSpinner(element){

//    }

   return {
       init: init,
       onClickBuyPlan: onClickBuyPlan,
       onClickSignatureBuy: onClickSignatureBuy,
       onClickPlatinumBuy: onClickPlatinumBuy
      
   }
}
