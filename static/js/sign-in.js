$(document).ready(function(){
	/**
	 * login submit handler.
	 * url: /sign-in
	 * callback {@link authSuccess}
	 * @event ".submit":click
	 */
	$(".log-in").click(function(event){
		event.preventDefault();
		var id= $("#userName").val();
		var userEmail = $("#user-email").val();
		var userPassword = $("#user-password").val();
		localStorage.id = id;
		postRequest("/sign-in", null, {id: id},authSuccess, authFail,true,null)
	})

	$(".login-tab.jobseeker").click(function(){
		window.location = "https://www.updazz.com/registration/login.php";
	})
});

/**
 * error handler for login
 * @param  {object} res ajax response object
 */
function authFail(res){
	$(".error-message").text(res.message);
	console.log(res.status);
}

/**
 * success handler for login
 * @param  {object} res ajax response object
 */
function authSuccess(res){
	console.log(res)
	if(res.status=="success"){
		window.location="/"
	}
	else
		$(".error-message").text(res.message);
}
