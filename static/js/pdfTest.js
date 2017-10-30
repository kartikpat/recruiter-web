var url = "https://cdn.mozilla.net/pdfjs/tracemonkey.pdf";
getBinaryData(url, function (res){
    console.log(res)
    PDFJS.getDocument(res).then(function getPdfHelloWorld(_pdfDoc) {
     var numPages = _pdfDoc.pdfInfo.numPages;
     console.log(numPages);

        for(var i = 1; i <= numPages; i++) {
            _pdfDoc.getPage(i).then(function(page) {
                var scale = 1.5;
                var viewport = page.getViewport(scale);
                viewProfileModal.find(".resume-embed-container").append("<canvas id='canvas-"+page.pageIndex+"'></canvas>");
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

});
