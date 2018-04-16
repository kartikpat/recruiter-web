jQuery(document).ready(function() {
	jQuery(".choose-file").on("click", function() {
		jQuery("#trigger-file-upload").trigger("click");
	})
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
