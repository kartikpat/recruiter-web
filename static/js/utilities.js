
jQuery(document).ready(function() {
	jQuery(".header .profile.action-icon").on('click', function() {
		jQuery(this).find(".profile-menu").toggleClass("active");
	});
	
});
