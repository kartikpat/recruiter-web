jQuery(".button-action-list").on("click", function() {
	jQuery(this).toggleClass("inactive");
})

jQuery(".candidates-listing").on("click", ".candidate-item", function(e) {
	if((!jQuery(e.target).parents(".candidate-item-section.profile-actions").length) && (!jQuery(e.target).parents(".candidate-item-section.image").length)) {
		console.log("Open View Resume modal");

		openViewResumeModal();
	}
});

var openViewResumeModal = function() {
	jQuery(".body-overlay").removeClass("hidden").addClass("veiled");
	jQuery("body").addClass("posf");
	jQuery(".view-resume-modal").removeClass("hidden");

	jQuery("#tabbed-content").tabs();
}

jQuery(".body-overlay").on("click", function(e) {
	if(jQuery(e.target).parents(".view-resume-modal").length) {
		e.stopImmediatePropagation();
	}
	jQuery(".view-resume-modal").addClass("hidden");
});