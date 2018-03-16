
jQuery(document).ready(function() {
	jQuery(".header .profile.action-icon").on('click', function() {
		jQuery(this).find(".profile-menu").toggleClass("active");
	});

	$(window).click(function(e) {
		if(!jQuery(e.target).parents(".header .profile-menu").length && !jQuery(e.target).parents(".header .profile.action-icon").length) {
			jQuery(".header .profile-menu").removeClass("active");
		}
		if(!jQuery(e.target).parents(".modal").length) {
			$("body").removeClass("posf")
			$(".modal").addClass("hidden")
		}
	});

	jQuery(".header").on("mouseenter", ".my-jobs", function() {
  		jQuery(this).find(".profile-menu").addClass("active")
	})

	jQuery(".header").on("mouseleave", ".my-jobs", function() {
  		jQuery(this).find(".profile-menu").removeClass("active")
	})

	$(".recruiterLogout").click(function(){
		document.cookie = "recruiter-access-token" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		window.location.href = "/login"
		return false
	})

	jQuery(".header .upgrade.button").on('click', function(e) {
		e.stopPropagation();
		window.location = "/recruiter/recruiter-plan"
	});

});
