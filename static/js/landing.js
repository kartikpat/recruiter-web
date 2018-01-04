$.fn.isInViewport = function() {
  var elementTop = $(this).offset().top;
  var elementBottom = elementTop + $(this).outerHeight();

  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  return elementBottom > viewportTop && elementTop < viewportBottom;
};

jQuery(document).ready(function() {
	if(jQuery(window).width() >= 1024) {
		$(window).on('load scroll', function() {
		  $('.hero-content').each(function() {
		  	if(!jQuery(this).hasClass('show')) {
		  		if ($(this).isInViewport()) {
			      $(this).addClass('show');
			    }	
		  	}
		  });
		});
	} else {
		jQuery(".highlight-wrapper .category-item").removeClass("border-bottom border-right");
		jQuery(".highlight-wrapper .category-item").each(function(i,el) {
			if(i%2 != 0) {
				jQuery(el).addClass("no-right-border");
			}
		});
		jQuery(".highlight-wrapper .category-item").eq(-1).addClass("no-bottom-border");
		jQuery(".highlight-wrapper .category-item").eq(-2).addClass("no-bottom-border");
	}
});