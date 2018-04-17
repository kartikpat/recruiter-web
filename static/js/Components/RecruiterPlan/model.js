function Plans() {

   var settings = {};

   function init(){
       settings.planContinue = $(".planContinue");
       settings.signatureBuy = $(".signatureBuy");
       settings.signatureContinue = $(".signature-continue");
       settings.platinumContinue = $(".platinum-continue");
       settings.platinumBuy = $(".platinumBuy");
       settings.planType = '';
       settings.signatureModal = $("#signature-modal");
       settings.platinumModal = $("#platinum-modal");
       settings.basicBuy = $(".basic-buy");

       onClickBasicBuy()

       onChangeInput()
   }

   function onChangeInput() {
       $(".modal").find("input").keyup(function(event){
           if (event.keyCode === 13) {
               return
           }
           $(".modal").find("input").next().addClass("hidden")
       })
   }

   function onClickBasicBuy() {
       settings.basicBuy.click(function() {
           window.location = "/my-jobs";
       })
   }

   function onClickSignatureBuy(fn) {
       settings.signatureBuy.click(function(e){
           var planType = $(this).attr("data-plantype");
           fn(planType)
       });
   }

   function onClickPlatinumBuy(fn) {
       settings.platinumBuy.click(function(e){
           var planType = $(this).attr("data-plantype");
           fn(planType)
       });
   }

   function onClickBuyPlan(fn) {
       settings.planContinue.click(function() {
           var planType = $(this).attr("data-plantype");
           var elem = $(this).closest(".modal").find("input");
           var contact = (elem.val()).trim();
           if(!contact) {
               elem.next().text("Input Can't be empty.").removeClass("hidden");
               return
           }
           fn(contact, planType)
       })
   }

   function openModal(type) {
       if(type == "signature") {
           addBodyFixed()
           settings.signatureModal.removeClass("hidden");
       }
       else if(type == "platinum") {
           addBodyFixed()
           settings.platinumModal.removeClass("hidden");
       }
   }

   	function showSpinner(type) {
   		if(type == "signature") {
   			settings.signatureBuy.addClass('hidden')
   			settings.signatureBuy.prev().removeClass("hidden")
   		}
   		else if(type == "platinum") {
   			settings.platinumBuy.addClass('hidden')
   			settings.platinumBuy.prev().removeClass("hidden")
   		}
   	}

    function showContinueSpinner(type) {
        if(type == "signature") {
            settings.signatureContinue.addClass('hidden')
            settings.signatureContinue.prev().removeClass("hidden")
        }
        else if(type == "platinum") {
            settings.platinumContinue.addClass('hidden')
            settings.platinumContinue.prev().removeClass("hidden")
        }
    }   
   	function hideSpinner(type){
        if(type == "signature") {
   			settings.signatureBuy.removeClass('hidden')
   			settings.signatureBuy.prev().addClass("hidden")
   		}
   		else if(type == "platinum") {
   			settings.platinumBuy.removeClass('hidden')
   			settings.platinumBuy.prev().addClass("hidden")
   		}
    }

    function hideContinueSpinner(type){
        if(type == "signature") {
            settings.signatureContinue.removeClass('hidden')
   			settings.signatureContinue.prev().addClass("hidden")
   		}
   		else if(type == "platinum") {
            settings.platinumContinue.removeClass('hidden')
            settings.platinumContinue.prev().addClass("hidden")
   		}
   	}
       


    function closeModal() {
		removeBodyFixed()
		$(".modal").addClass("hidden")
	}


   return {
       init: init,
       onClickBuyPlan: onClickBuyPlan,
       onClickSignatureBuy: onClickSignatureBuy,
       onClickPlatinumBuy: onClickPlatinumBuy,
       openModal: openModal,
       showSpinner: showSpinner,
       hideSpinner: hideSpinner,
       showContinueSpinner:showContinueSpinner,
       hideContinueSpinner:hideContinueSpinner,
       closeModal: closeModal

   }
}
