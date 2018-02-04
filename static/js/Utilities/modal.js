var closeModal = function() {
	jQuery("html").removeClass("overflow_hidden");
	jQuery(".modal").addClass("hidden");
};

jQuery(".modal_close").on("click", function() {
	closeModal();
});
