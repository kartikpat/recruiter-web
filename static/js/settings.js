jQuery(document).ready(function() {
	jQuery(".choose-file").on("click", function() {
		jQuery("#trigger-file-upload").trigger("click");
	})
});

jQuery(".settings-sidebar").on("click", "li", function() {
	jQuery(this).addClass("active");
	jQuery(this).siblings().removeClass("active");
});