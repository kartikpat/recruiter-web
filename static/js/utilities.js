//Setting Domain from Config
(function() {
	document.querySelector(".domain_logo h1").innerText = baseDomain;

	jQuery(".header .profile.action-icon").on('click', function() {
		jQuery(this).find(".profile-menu").toggleClass("active");
	});
}());


jQuery(document).ready(function() {
	console.log("Bhalle")
	document.querySelector(".domain_logo h1").innerText = baseDomain;

	jQuery(".header .profile.action-icon").on('click', function() {
		jQuery(this).find(".profile-menu").toggleClass("active");
	});
});