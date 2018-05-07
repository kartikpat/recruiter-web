function sendPageView(title, path, location){
	gtag('config', trackingId, {
	  'page_title' : title,
	  'page_path': path,
	  'page_location': location
	});
}
function sendEvent(action, additionalObject){
	// var sampleAdditinalObject = {
	// 	event_category: 'some category',
	// 	event_label: 'some label',
	// 	value: 'any value'
	// }
	gtag('event', action, additionalObject);
}
