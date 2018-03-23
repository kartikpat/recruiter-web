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

	// jQuery(".trigger-register-registration-modal").on('click', function() {
	// 	jQuery("body").addClass("fixed");
	// 	jQuery(".recruiter-sign-in-modal").addClass("hidden");
	// 	jQuery(".modal-overlay").removeClass("hidden");
	// 	jQuery(".recruiter-register-modal").removeClass("hidden");
    //     return false
	// });

    $("#loginForm").on('click',".trigger-register-registration-modal", function() {
		jQuery("body").addClass("fixed");
		jQuery(".recruiter-sign-in-modal").addClass("hidden");
		jQuery(".modal-overlay").removeClass("hidden");
		jQuery(".recruiter-register-modal").removeClass("hidden");
        return false
	});

	jQuery(".trigger-register-sign-in-modal").on('click', function() {
		jQuery("body").addClass("fixed");
		jQuery(".recruiter-register-modal").addClass("hidden");
		jQuery(".modal-overlay").removeClass("hidden");
		jQuery(".recruiter-sign-in-modal").removeClass("hidden");
	});

	jQuery(".close-modal").on("click", function() {
		jQuery("body").removeClass("fixed");
		jQuery(".modal-content").addClass("hidden");
		jQuery(".modal-overlay").addClass("hidden");

	})

	jQuery(".modal-overlay").on("click", function(e) {
		if(!jQuery(e.target).parents(".modal-overlay").length) {
			jQuery("body").removeClass("fixed");
			jQuery(this).addClass("hidden");
		}
	})
});
