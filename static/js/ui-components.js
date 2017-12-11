// Toggle Select field to be active/inactive
// jQuery(".select-dropdown").on('click', function() {
//   jQuery(this).toggleClass('inactive');
// })

jQuery(".course-option").on('click', function() {
	jQuery(this).toggleClass("active");
	jQuery(this).siblings().removeClass("active");
})

jQuery(".button-action-list").on("click", function() {
	jQuery(this).toggleClass("inactive");
})