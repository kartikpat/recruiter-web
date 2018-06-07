var viewProfileModal = jQuery(".js_resume");

// jQuery(".button-action-list").on("click", function() {
// 	jQuery(this).toggleClass("inactive");
// })
function getId() {
	return viewProfileModal.closest(".candidateDetailsModal").attr("data-application-id");
}
function resumeCallback(res, id){
    
    PDFJS.getDocument(res).then(function getPdfHelloWorld(_pdfDoc) {

     	var numPages = _pdfDoc.pdfInfo.numPages;

		viewProfileModal.empty();
        for(var i = 1; i <= numPages; i++) {
            _pdfDoc.getPage(i).then(function(page) {

				if(!(id == parseInt(getId()))){
					return
				}

                var scale = 1.5;
                var viewport = page.getViewport(scale);
                viewProfileModal.append("<canvas id='canvas-"+page.pageIndex+"' class='canvas'></canvas>");
                var canvas = document.getElementById("canvas-"+page.pageIndex+"");
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
				// var destr = new PDFJS.PDFDocumentLoadingTask();
                // Render PDF page into canvas context
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.then(function () {
                //   $(".candidateResumeShell").addClass("hidden")
				  viewProfileModal.removeClass("hidden");
                });
         });
        }
    }, function (reason) {
  		// PDF loading error
  		console.log(reason);
		viewProfileModal.html("<div class='no-data'>No Resume Found!</div>")
		$(".loaderScrollerResume").addClass("hidden")
		viewProfileModal.removeClass("hidden");
	})
}

jQuery(".first-fold").on('click', ".view-more", function() {
  $(".second-fold").toggleClass("hidden	")
});


jQuery(".detail").on('click', function() {
    $(".action-fold").toggleClass("hidden	")
  });

// function hello() {
//
// 	// PDFJS.destroy()
//
// 	destr.destroy().then(function(res){
// 		console.log(res)
// 	}, function(res) {
// 		console.log(res)
// 	})
// }
