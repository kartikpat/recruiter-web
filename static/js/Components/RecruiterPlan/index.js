jQuery(document).ready( function() {
	var stat = getQueryParameter("jobPostSuccess")
	if(parseInt(stat) == 1) {
		toastNotify(1, "Job Posted Successfully!")
	}
}
