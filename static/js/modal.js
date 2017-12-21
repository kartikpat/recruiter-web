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