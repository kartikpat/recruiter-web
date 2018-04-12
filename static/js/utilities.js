
jQuery(document).ready(function(){
	jQuery(".header .profile.action-icon").on('click', function() {
		jQuery(this).find(".profile-menu").toggleClass("active");
	});

	$(window).click(function(e) {

		if(!jQuery(e.target).parents(".header .profile-menu").length && !jQuery(e.target).parents(".header .profile.action-icon").length) {
			jQuery(".header .profile-menu").removeClass("active");
		}
		// if(!jQuery(e.target).parents(".modal").length) {
		// 	$("body").removeClass("posf")
		// 	$(".modal").addClass("hidden")
		// }
	});

	jQuery(".header").on("mouseenter", ".my-jobs", function() {
  		jQuery(this).find(".profile-menu").addClass("active")
	})

	jQuery(".header").on("mouseleave", ".my-jobs", function() {
  		jQuery(this).find(".profile-menu").removeClass("active")
	})

	jQuery(".header").on("mouseenter", ".my-interviews", function() {
		jQuery(this).find(".profile-menu").addClass("active")
 	})

	  jQuery(".header").on("mouseleave", ".my-interviews", function() {
		jQuery(this).find(".profile-menu").removeClass("active")
  	})

	

	jQuery(".header .upgrade.button").on('click', function(e) {
		e.stopPropagation();
		window.location = "/recruiter/recruiter-plan"
	});

});
