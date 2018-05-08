$(document).ready(function() {
	var admin = Admin();
	admin.init();
	admin.loginHandler(function(e){
		e.preventDefault()

		if(admin.validateLogin()){
            var data = admin.getData()
			submitAdminLogin(data);
		}
	})

	function onSuccessfulReset(topic, data){
		window.location.href= staticEndPoints.dashboard;

	}
	function onFailedReset(topic, data){
		admin.errorHandler(data);
	}

	var resetSuccessSubscription = pubsub.subscribe('adminLoginSuccess', onSuccessfulReset );
	var resetFailSubscription = pubsub.subscribe('adminLoginFail', onFailedReset)
});
