jQuery(document).ready(function() {
	jQuery(".choose-file").on("click", function() {
		jQuery("#trigger-file-upload").trigger("click");
	})
});

jQuery(".settings-sidebar, .settings-mobile-nav").on("click", "li", function() {
	var activeSection = jQuery(this).attr("data-selector");
	
	jQuery(this).addClass("active");
	jQuery(this).siblings().removeClass("active");
	jQuery(".settings-section."+activeSection).removeClass("hidden").siblings().addClass("hidden");
});

var textarea = document.querySelector('#profile-about');

textarea.addEventListener('keydown', autosize);

function autosize(){
  var el = this;
  setTimeout(function(){
    el.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    el.style.cssText = '-moz-box-sizing:content-box';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
}
