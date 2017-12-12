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

jQuery(".pill-button input").on('focus', function() {
	jQuery(this).parent().toggleClass("inactive");
});

jQuery(".pill-button input").on('blur', function() {
	jQuery(this).parent().addClass("inactive");
});

jQuery(".pill-button input").on('keyup', function(e) {
	var searchString = jQuery(this).val();
	jQuery(this).siblings(".pill-listing").find("ul li").each(function(i,el) {
		if(jQuery(el).text().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
			jQuery(el).removeClass("hidden");
		} else {
			jQuery(el).addClass("hidden");
		}
	})
});