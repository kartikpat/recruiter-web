jQuery(".modal-overlay").on("click", ".close-modal", function(e) {
    jQuery("body").removeClass("posf");
    jQuery(".modal-overlay").addClass("hidden")
})

jQuery(".guideline-modal-trigger").on("click", function() {
    jQuery("body").addClass("posf");
    jQuery(".modal-overlay").removeClass("hidden")
});

jQuery(".modal-overlay").on('click', function(e) {
    if (jQuery(e.target).is(".modal-overlay")) {
        jQuery(this).addClass("hidden");
        jQuery("body").removeClass("posf")
    }
});

jQuery(".modal_overlay").on("click",".category_listing li",function() {
  jQuery(this).addClass("active");
  jQuery(this).siblings().removeClass("active");
  var title = jQuery(this).text();
  var selector = jQuery(this).attr("data-selector");
  jQuery(".modal_content").find(".modal_body .modal_body_header span").html(title);
  jQuery(".modal_overlay").find(".subcategory_listing").hide();
  jQuery(".modal_overlay").find(".subcategory_listing." + selector).show();
  jQuery(".modal_body").scrollTop(0);
});

jQuery(".modal_overlay").on('click', ".close_modal",function(e) {
    jQuery("body").removeClass("posf");
    jQuery(".modal_overlay").addClass("hidden");
});