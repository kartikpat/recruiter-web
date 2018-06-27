var flagMapper = {
	1:"success",
	2:"warning",
	3:"toasterror"
};

function toastNotify(messageFlag, messageContent,param) {
	
	if(param){
		$(".toast-notification .notifyLoader").removeClass('hidden');
	}
	var messageType = flagMapper[messageFlag];
	var toastNotif = jQuery(".toast-notification-container");
	toastNotif.addClass(messageType).find(".notification-icon").addClass(messageType);
	toastNotif.addClass("show");

	toastNotif.find(".notification-message p").text(messageContent);
	setTimeout(closeToastNotification,3000);
}

function closeToastNotification() {
	var toastNotif = jQuery(".toast-notification-container");
	toastNotif.attr("class", "toast-notification-container");
	$(".toast-notification .notifyLoader").addClass('hidden');

}
