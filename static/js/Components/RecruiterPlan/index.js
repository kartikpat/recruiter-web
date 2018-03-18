jQuery(document).ready( function() {

	if(localStorage.getItem("jobPostSuccessMessage") != null) {
		toastNotify(1, localStorage.getItem("jobPostSuccessMessage"))
		localStorage.removeItem("jobPostSuccessMessage");
	}
}
