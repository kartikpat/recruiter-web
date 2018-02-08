jQuery(".modal-overlay").on("click", ".close-modal", function(e) {
    jQuery("body").removeClass("posf");
    jQuery(".modal-overlay").addClass("hidden")
})

jQuery(".guideline-modal-trigger").on("click", function() {
    jQuery("body").addClass("posf");
    jQuery(".modal-overlay").removeClass("hidden")
});

jQuery(".modal-overlay").on('click', function(e) {
    if (jQuery(e.target).is(".modal-overlay")) {
        jQuery(this).addClass("hidden");
        jQuery("body").removeClass("posf")
    }
});

jQuery(".modal_overlay").on("click",".category_listing li",function() {
  jQuery(this).addClass("active");
  jQuery(this).siblings().removeClass("active");
  var title = jQuery(this).text();
  var selector = jQuery(this).attr("data-selector");
  jQuery(".modal_content").find(".modal_body .modal_body_header .title").html(title);
  jQuery(".modal_overlay").find(".subcategory_listing").hide();
  jQuery(".modal_overlay").find(".subcategory_listing." + selector).show();
  jQuery(".modal_body").scrollTop(0);
});

jQuery(".modal_overlay").on('click', ".close_modal",function(e) {
    jQuery("body").removeClass("posf");
    jQuery(".modal_overlay").addClass("hidden");
});

industryTagsData.forEach(function(anObj) {
    var checkbox = $(".jsCheckInput.prototype").clone().removeClass("prototype hidden");
    checkbox.find(".in").attr("value", anObj["val"]);
    checkbox.find(".in").attr("id", "indus-"+anObj["val"]);
    checkbox.find(".lab").text(anObj["text"]);
    checkbox.find(".lab").attr("for","indus-"+anObj["val"]);
    $(".jsIndustry").append(checkbox);
})

currentLocationTagsData.forEach(function(anObj) {
    var checkbox = $(".jsCheckInput.prototype").clone().removeClass("prototype hidden");
    checkbox.find(".in").attr("value", anObj["val"]);
    checkbox.find(".in").attr("id", "curloc-"+anObj["val"]);
    checkbox.find(".lab").text(anObj["text"]);
    checkbox.find(".lab").attr("for","curloc-"+anObj["val"]);
    $(".jsCurLoc").append(checkbox);
})

prefeLocationTagsData.forEach(function(anObj) {
    var checkbox = $(".jsCheckInput.prototype").clone().removeClass("prototype hidden");
    checkbox.find(".in").attr("value", anObj["val"]);
    checkbox.find(".in").attr("id", "prefloc-"+anObj["val"]);
    checkbox.find(".lab").text(anObj["text"]);
    checkbox.find(".lab").attr("for","prefloc-"+anObj["val"]);
    $(".jsPrefLoc").append(checkbox);
})

functionalAreaTagsData.forEach(function(anObj) {
    var checkbox = $(".jsCheckInput.prototype").clone().removeClass("prototype hidden");
    checkbox.find(".in").attr("value", anObj["val"]);
    checkbox.find(".in").attr("id", "funcArea-"+anObj["val"]);
    checkbox.find(".lab").text(anObj["text"]);
    checkbox.find(".lab").attr("for","funcArea-"+anObj["val"]);
    $(".jsFuncArea").append(checkbox);
})

instituteTagsData.forEach(function(anObj) {
    var checkbox = $(".jsCheckInput.prototype").clone().removeClass("prototype hidden");
    checkbox.find(".in").attr("value", anObj["val"]);
    checkbox.find(".in").attr("id", "inst-"+anObj["val"]);
    checkbox.find(".lab").text(anObj["text"]);
    checkbox.find(".lab").attr("for","inst-"+anObj["val"]);
    $(".jsInstitute").append(checkbox);
})

languageTagsData.forEach(function(anObj) {
    var checkbox = $(".jsCheckInput.prototype").clone().removeClass("prototype hidden");
    checkbox.find(".in").attr("value", anObj["val"]);
    checkbox.find(".in").attr("id",  "lang-"+anObj["val"]);
    checkbox.find(".lab").text(anObj["text"]);
    checkbox.find(".lab").attr("for", "lang-"+anObj["val"]);
    $(".jsLanguage").append(checkbox);
})
