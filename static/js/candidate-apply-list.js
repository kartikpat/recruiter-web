var viewProfileModal = jQuery("#view-resume");

jQuery(".button-action-list").on("click", function() {
	jQuery(this).toggleClass("inactive");
})

jQuery(".candidates-listing").on("click", ".candidate-item", function(e) {
	if((!jQuery(e.target).parents(".candidate-item-section.profile-actions").length) && (!jQuery(e.target).parents(".candidate-item-section.image").length)) {
		console.log("Open View Resume modal");

		openViewResumeModal();
	}
});

var openViewResumeModal = function() {
	jQuery(".body-overlay").removeClass("hidden").addClass("veiled");
	jQuery("body").addClass("posf");
	jQuery(".view-resume-modal").removeClass("hidden");

	jQuery("#tabbed-content").tabs({

		create:function(){
			console.log("Gol Gappe");

			viewProfileModal.find(".resume-embed-container").empty();
			if(isCanvasSupported()) {
				getBinaryData("https://s3.ap-south-1.amazonaws.com/pat-resume-bucket/Resume.pdf",resumeCallback);
			}
			else {
				viewProfileModal.html('<iframe src="http://dfdceb975cf775e45220-2337082ec7eb862d3cd0ed59dd611802.r50.cf1.rackcdn.com/media/profiles/2017/01/24/2017-01-24-22-21-29-72691.pdf" class="resume-embed" type="application/pdf"></iframe>')
			}

		}
	});
}

jQuery(".body-overlay").on("click", function(e) {
	if(jQuery(e.target).parents(".view-resume-modal").length) {
		e.stopImmediatePropagation();
	}
	jQuery(".view-resume-modal").addClass("hidden");
});


function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}


function resumeCallback(res){
    console.log(res)
    PDFJS.getDocument(res).then(function getPdfHelloWorld(_pdfDoc) {
     var numPages = _pdfDoc.pdfInfo.numPages;
     console.log(numPages);

        for(var i = 1; i <= numPages; i++) {
            _pdfDoc.getPage(i).then(function(page) {
                var scale = 1.5;
                var viewport = page.getViewport(scale);
                viewProfileModal.append("<canvas id='canvas-"+page.pageIndex+"' class='canvas'></canvas>");
                var canvas = document.getElementById("canvas-"+page.pageIndex+"");
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.then(function () {
                  console.log('Page rendered');
                });
         });
        }
    });
}

jQuery(".first-fold").on('click', ".view-more", function() {
  if(jQuery(".first-fold").hasClass("top")){
    jQuery(".first-fold").removeClass("top");
    jQuery(".second-fold").addClass("top").removeClass("hidden");
  } else {
    jQuery(".first-fold").addClass("top");
    jQuery(".second-fold").addClass("hidden").removeClass("top");
  }
});