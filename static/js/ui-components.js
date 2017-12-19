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
	jQuery(this).attr("placeholder", jQuery(this).attr("data-placeholder-value"));
});

jQuery(".pill-button input").on('keyup', function(e) {
	var searchString = jQuery(this).val();
	jQuery(this).siblings(".pill-listing").find("ul li").each(function(i,el) {
		if(jQuery(el).text().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
			jQuery(el).removeClass("hidden");
		} else {
			jQuery(el).addClass("hidden");
		}
	});
	if(jQuery(".pill-listing li").not(".hidden").length == 0){
		console.warn("All list items hidden!");
		jQuery(".pill-listing ul").addClass("hidden");
	} else {
		jQuery(".pill-listing ul").removeClass("hidden");
	}
});

jQuery(".tag-container").on("mouseenter", ".pill-listing li", function() {
	jQuery(this).addClass("selected");
	jQuery(this).siblings().removeClass("selected");
	jQuery(this).closest(".pill-listing").siblings("input").attr("placeholder", jQuery(this).text());
});

jQuery(".tag-container").on("mouseleave", ".pill-listing li", function() {
	jQuery(this).removeClass("selected");
	jQuery(this).siblings().removeClass("selected");
});


jQuery(".tag-container").on("mousedown", ".pill-listing li", function() {
	var selectedValue = jQuery(this).text();
	addNewTag(selectedValue,  jQuery(this).attr("data-value"), jQuery(this).closest(".tag-container"));
});

jQuery("body").on("mousedown", "li", function(e) {
	var tagName = jQuery(this).text();
	var tag = jQuery(".tag.prototype.hidden").clone().removeClass("prototype hidden");
});

jQuery(".tag-container").on("keydown", ".pill-button input[type=text]", function(e) {
	var listItems = jQuery(this).siblings(".pill-listing").find("li");
	var selectedItem =  jQuery(this).siblings(".pill-listing").find("li.selected");
	switch(e.which){
		case 38:console.log("Up Arrow");
				if(selectedItem.length == 0 ) {
					console.log("No Selected option. Tagging first visible option.");
					jQuery(this).siblings(".pill-listing").find("li:visible").last(0).addClass("selected");
				} else {
					var newSelectedItem = selectedItem.prevAll("li:visible").first();
					console.log(newSelectedItem);
					if(newSelectedItem.length) {
						newSelectedItem.addClass("selected");
						selectedItem.removeClass("selected");
					}
						
				}
				break;
		case 40:console.log("Down Arrow");
				if(selectedItem.length == 0 ) {
					console.log("No Selected option. Tagging first visible option.");
					jQuery(this).siblings(".pill-listing").find("li:visible").eq(0).addClass("selected");
				} else {
					var newSelectedItem = selectedItem.nextAll("li:visible").first();
					if(newSelectedItem.length) {
						newSelectedItem.addClass("selected");
						selectedItem.removeClass("selected");
					}
				}
				break;
		case 13:if(selectedItem.length) {
					console.log("Submitted option!");
					addNewTag(selectedItem.text(), selectedItem.attr("data-value"),jQuery(this).closest(".tag-container"));
				}
				break;
		default:break;
	}
});

jQuery(".tag-container").on("click", ".input-tag .tag-remove", function() {
	var selector = jQuery(this).closest(".input-tag").attr("data-id");
	// console.log(jQuery(this).closest(".input-tag").attr("data-id"));
	jQuery(this).closest(".tag-container").find("li.tag-added").each(function(i,el) {
		// console.log(jQuery(el).attr("data-value") + "|" + selector);
		if(jQuery(el).attr("data-value") == selector) {
			jQuery(el).removeClass("tag-added");
		}
	})
	jQuery(this).closest(".input-tag").remove();
});
function addNewTag(labelName, labelValue, selector) {
	console.log(labelName, selector);

	var tag = jQuery(".input-tag.prototype.hidden").clone().removeClass("prototype hidden");
	tag.attr("data-id",labelValue);
	tag.find(".tag-name span").html(labelName);
	jQuery(selector).find(".pill-button").before(tag);

	jQuery(selector).find(".pill-listing li.selected").addClass("tag-added").removeClass("selected");
}