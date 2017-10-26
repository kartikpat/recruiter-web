var url = "https://cdn.mozilla.net/pdfjs/tracemonkey.pdf";
getBinaryData(url, function (res){
    console.log(res)
    PDFJS.getDocument(res).then(function getPdfHelloWorld(_pdfDoc) {
     var numPages = _pdfDoc.pdfInfo.numPages;
     console.log(numPages);
    $("#pdf-page").attr("src",url)
   //  for(var i = 1; i <= 1; i++) {
   //      _pdfDoc.getPage(i).then(function(page) {
   //          var scale = 1.5;
   //          var viewport = page.getViewport(scale);
   //
   // // Prepare canvas using PDF page dimensions
   //          var canvas = document.getElementById('pdf-page');
   //          var context = canvas.getContext('2d');
   //          canvas.height = viewport.height;
   //          canvas.width = viewport.width;
   //
   //     // Render PDF page into canvas context
   //      var renderContext = {
   //       canvasContext: context,
   //       viewport: viewport
   //     };
   //     var renderTask = page.render(renderContext);
   //     renderTask.then(function () {
   //       console.log('Page rendered');
   //     });
   //
   //   });
   //  }

        });
});
