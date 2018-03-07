var closeModal = function() {
	jQuery("body").removeClass("posf");
	jQuery(".modal").addClass("hidden");
};

jQuery(".modal_close").on("click", function() {
	closeModal();
});
