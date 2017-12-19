jQuery(document).ready(function() {
	jQuery(".choose-file").on("click", function() {
		jQuery("#trigger-file-upload").trigger("click");
	})
});

jQuery(".settings-sidebar").on("click", "li", function() {
	var activeSection = jQuery(this).attr("data-selector");
	console.log(activeSection);
	jQuery(this).addClass("active");
	jQuery(this).siblings().removeClass("active");
	jQuery(".settings-section."+activeSection).removeClass("hidden").siblings().addClass("hidden");
});