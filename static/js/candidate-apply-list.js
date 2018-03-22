var viewProfileModal = jQuery("#view-resume");

jQuery(".button-action-list").on("click", function() {
	jQuery(this).toggleClass("inactive");
})




function resumeCallback(res){

    PDFJS.getDocument(res).then(function getPdfHelloWorld(_pdfDoc) {
     var numPages = _pdfDoc.pdfInfo.numPages;
	 	viewProfileModal.html('');
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
    }, function (reason) {
  		// PDF loading error
  		console.log(reason);
		viewProfileModal.html("<div class='no-data'>No Resume Found!</div>")
	})
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
