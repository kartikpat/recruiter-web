

jQuery(".modal_close").on("click", function() {

	jQuery("body").removeClass("posf");
	jQuery(".modal").addClass("hidden");
});

$(".modal").click(function(event){
	if($(event.target).parents(".modal_content").length || $(event.target).parents(".modal_header").length) {
		return event.stopPropagation();
	}
	closeModal();
})


function closeModal() {
	removeBodyFixed()
	$(".modal").addClass("hidden")
}

function addBodyFixed() {
	jQuery("body").addClass("posf");
}

function removeBodyFixed(){
	jQuery("body").removeClass("posf");
}

