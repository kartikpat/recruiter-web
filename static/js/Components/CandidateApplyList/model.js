function Candidates() {
    function cloneElement(id) {
		var card = $('.table-row.job.prototype').clone().removeClass('prototype hidden')
		card.attr('id', 'candidate-'+id);
		return {
			element: card,
			createdOn: card.find('.js_createdOn'),
			title: card.find('.js_title'),
			location: card.find('.js_location'),
			multipleLocation: card.find('.js_multipleLocation'),
			seperator: card.find('.js_seperator'),
			experience: card.find('.js_experience'),
			status: card.find('.js_status'),
			statusMsg: card.find('.js_status_msg'),
			views: card.find('.js_views'),
			applications: card.find('.js_applications'),
			edit: card.find('.js_edit'),
			cancel: card.find('.js_cancel'),
			refresh: card.find('.js_refresh'),
			premium: card.find('.js_premium'),
			facebook: card.find('.js_facebook'),
			twitter: card.find('.js_twiiter'),
			linkedIn: card.find('.js_linkedIn')
		}
	}
}
