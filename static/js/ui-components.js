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

	if(jQuery(this).closest(".tag-container").attr("data-enable-custom") && jQuery(this).closest(".tag-container").attr("data-enable-custom") == "true") {
		jQuery(this).siblings(".pill-listing").find("li[data-value=custom]").text(searchString);
	}
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


	jQuery(this).siblings(".pill-listing").find("li[data-value=custom]").addClass("hidden");
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
	var selector = jQuery(this).closest(".tag-container");
	if(checkMaxTags(selector)) {
		selector.closest(".field-container").find(".error").removeClass("hidden")
		var selectedValue = jQuery(this).text();
		addNewTag(selectedValue,  jQuery(this).attr("data-value"), jQuery(this).closest(".tag-container"));
	}

});

jQuery(document).ready(function(){
	jQuery(".tag-container").each(function(i,el) {
		if(jQuery(el).attr("data-enable-custom")== "true") {
			jQuery(el).find(".pill-listing ul").prepend("<li data-value='custom' class='hidden'></li>");
		}
	});
});

jQuery(".tag-container").on("keydown", ".pill-button input[type=text]", function(e) {
	var listItems = jQuery(this).siblings(".pill-listing").find("li");
	var selectedItem =  jQuery(this).siblings(".pill-listing").find("li.selected");
	var closestTag = jQuery(this).closest(".tag-container");
	switch(e.which){
		case 38:
				if(selectedItem.length == 0 ) {
					jQuery(this).siblings(".pill-listing").find("li:visible").last(0).addClass("selected");
				} else {
					var newSelectedItem = selectedItem.prevAll("li:visible").first();
					if(newSelectedItem.length) {
						newSelectedItem.addClass("selected");
						selectedItem.removeClass("selected");
					}
				}

				var selectedOption = jQuery(this).siblings(".pill-listing").find("li.selected");
				console.log(selectedOption.position().top);
				jQuery(this).siblings(".pill-listing").find("ul").scrollTop(0)
				jQuery(this).siblings(".pill-listing").find("ul").scrollTop(selectedOption.position().top);

				break;
		case 40:
				if(selectedItem.length == 0 ) {
					jQuery(this).siblings(".pill-listing").find("li:visible").eq(0).addClass("selected");
				} else {
					var newSelectedItem = selectedItem.nextAll("li:visible").first();
					if(newSelectedItem.length) {
						newSelectedItem.addClass("selected");
						selectedItem.removeClass("selected");
					}
				}

				var selectedOption = jQuery(this).siblings(".pill-listing").find("li.selected");
				console.log(selectedOption.position().top);
				jQuery(this).siblings(".pill-listing").find("ul").scrollTop(0)
				jQuery(this).siblings(".pill-listing").find("ul").scrollTop(selectedOption.position().top);

				break;
		case 13:
				if(closestTag.attr("data-enable-custom") && closestTag.attr("data-enable-custom") == "true") {
					if(checkMaxTags(listItems.closest(".tag-container"))){
							addNewTag(jQuery(this).val(), selectedItem.attr("data-value"),jQuery(this).closest(".tag-container"));
						}
				} else {
					if(selectedItem.length) {
						if(checkMaxTags(listItems.closest(".tag-container"))){
							addNewTag(selectedItem.text(), selectedItem.attr("data-value"),jQuery(this).closest(".tag-container"));
						}
					}
				}
				break;
		default:
				break;
	};

	var selectedOption = jQuery(this).siblings(".pill-listing").find("li.selected");
	jQuery(this).attr("placeholder", selectedOption.text() || jQuery(this).attr("data-placeholder-value"));
});

jQuery(".tag-container").on("click", ".input-tag .tag-remove", function() {
	var selector = jQuery(this).closest(".input-tag").attr("data-id");
	jQuery(this).closest(".tag-container").find("li.tag-added").each(function(i,el) {
		if(jQuery(el).attr("data-value") == selector) {
			jQuery(el).removeClass("tag-added");
		}
	})
	jQuery(this).closest(".input-tag").remove();
});

jQuery(".tag-container").on("mouseenter",".tag-icons", function() {
	jQuery(this).find(".tag-added").addClass("hidden");
	jQuery(this).find(".tag-remove").removeClass("hidden");
});

jQuery(".tag-container").on("mouseleave",".tag-icons", function() {
	jQuery(this).find(".tag-remove").addClass("hidden");
	jQuery(this).find(".tag-added").removeClass("hidden");
});


function addNewTag(labelName, labelValue, selector) {
	// console.log(labelName, selector);

	var tag = jQuery(".input-tag.prototype.hidden").clone().removeClass("prototype hidden");
	tag.attr("data-id",labelValue);
	tag.attr("data-name", labelName);
	tag.find(".tag-name span").html(labelName);
	jQuery(selector).find(".pill-button").before(tag);

	jQuery(selector).find("input[type=text]").val('');
	jQuery(selector).find(".pill-listing ul li").removeClass("hidden");

	jQuery(selector).find(".pill-listing li.selected").addClass("tag-added").removeClass("selected");

	if(jQuery(selector).attr("data-enable-custom") && jQuery(selector).attr("data-enable-custom") == "true") {
		tag.find(".pill-listing ul").prepend("<li data-value='custom' class='hidden'></li>")
		jQuery(selector).find(".pill-listing li[data-value=custom]").removeClass("tag-added");
	}
}

function checkMaxTags(selector) {
	var maxOptions = jQuery(selector).attr("data-max-options") || 5;

	var currentOptions = jQuery(selector).find(".input-tag").length;
	// console.log("Max : " + maxOptions, "Current : " + currentOptions);
	if(currentOptions >= maxOptions) {
		sendErrorMessage(selector,"Please choose at most " + maxOptions + " values.");
		jQuery(selector).find("input").trigger("blur");
		return 0;
	} else {
		return 1;
	}
}

function sendErrorMessage(selector, errorString) {
	jQuery(selector).closest(".field-container").find(".error").removeClass("hidden").html(errorString);
	return false;
}
