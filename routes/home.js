/***
home.js
This module contains all the view rendering.
What all is visible to the eyes comes right through here.
**/

var assetsMapper = require("../asset-mapper.json")

module.exports = function(settings){
	var app = settings.app;
	var mode = settings.mode;
	var config = settings.config;
	var env = settings.env;
	var baseUrl = config["baseUrl"];
	var request = settings["request"];
	var baseDomain = config["baseDomain"];
	if(env=="local")
		baseUrl= config["baseUrl_local"];
	else
		baseUrl = config["baseUrl"];
	function isAuthenticated(req, res, next) {
		// for disabling authentication
		//return next()
		//bypassing the auth for development
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    	if (req.session.user)
        	return next();
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE


    	res.redirect('/sign-in');
	}
	app.post("/sign-in", function(req, res){
		var email = req.body.email || null;
		var password = req.body.password || null;
		if(! ( email && password ) ){
			res.status(422).json({
				status: 'fail',
				message: 'missing parameters'
			});
			return
		}
		request.post({
		  url:     baseUrl+'/recruiter/login',
		  body:  "email="+email+"&password="+password,
		  form: {email: email, password: password }
		}, function(error, response, body){
			console.log(body)
			var jsonBody = JSON.parse(body);
		  if(jsonBody.status=="success"){
		  	var cookieValue = new Buffer.from(""+Date.now()).toString('base64');
			res.cookie("sessID", cookieValue, {overwrite: true})
			req.session.user=cookieValue;
		  }
		  res.json(jsonBody)
		});
	})
	app.get("/", isAuthenticated,function(req, res){
		res.render("dashboard", {
			title: "IIM JOBS | Dashboard",
			styles:  assetsMapper["dashboard"]["styles"][mode],
			scripts: assetsMapper["dashboard"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain
		});
		return
	});

	app.get("/dashboard-clone", isAuthenticated,function(req, res){
		res.render("index-one", {
			title: "IIM JOBS | Dashboard",
			styles:  assetsMapper["index-one"]["styles"][mode],
			scripts: assetsMapper["index-one"]["scripts"][mode],
			baseUrl: baseUrl
		});
		return
	});

	app.get("/sign-in",function(req, res){
		res.render("sign-in", {
			title: "IIM JOBS | Sign in",
			styles:  assetsMapper["sign-in"]["styles"][mode],
			scripts: assetsMapper["sign-in"]["scripts"][mode],
			baseUrl: baseUrl
		});
		return
	});



	app.get("/post-job",isAuthenticated, function(req, res){
		res.render("post-job",{
			title: "IIM JOBS | Post job",
			styles:  assetsMapper["post-job"]["styles"][mode],
			scripts: assetsMapper["post-job"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	})

	app.get("/job/:jobID/candidates",isAuthenticated, function(req, res){
		var jobID = req.params.jobID;
		res.render("candidate-list", {
			title: "IIM JOBS | Candidates",
			styles:  assetsMapper["candidate-list"]["styles"][mode],
			scripts: assetsMapper["candidate-list"]["scripts"][mode],
			baseUrl: baseUrl,
			jobID: jobID
		})
		return
	})

	app.get("/job/:jobID/candidates-one",isAuthenticated, function(req, res){
		var jobID = req.params.jobID;
		res.render("candidate-list-one", {
			title: "IIM JOBS | Candidates",
			styles:  assetsMapper["candidate-list-one"]["styles"][mode],
			scripts: assetsMapper["candidate-list-one"]["scripts"][mode],
			baseUrl: baseUrl,
			jobID: jobID
		})
		return
	})

	app.get("/profile/:userID",isAuthenticated, function(req, res){
		var userID = req.params.userID;
		var jobID = req.query.jobID || null;
		res.render("view-resume",{
			title: "IIM JOBS | View Resume",
			styles:  assetsMapper["view-resume"]["styles"][mode],
			scripts: assetsMapper["view-resume"]["scripts"][mode],
			baseUrl: baseUrl,
			userID: userID,
			jobID: jobID
		})
		return
	});

	app.get("/calendar",isAuthenticated, function(req, res){
		res.render("calendar",{
			title: "IIM JOBS | Calendar",
			styles:  assetsMapper["calendar"]["styles"][mode],
			scripts: assetsMapper["calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/login", function(req, res){
		res.render("login",{
			title: "IIM JOBS | Login",
			styles:  assetsMapper["login"]["styles"][mode],
			scripts: assetsMapper["login"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/logout", function(req,res){
		req.session = null;

		res.redirect("/");

	});

	app.get("/view-reports",isAuthenticated, function(req, res){
		res.render("view-reports",{
			title: "IIM JOBS | View Reports",
			styles:  assetsMapper["view-reports"]["styles"][mode],
			scripts: assetsMapper["view-reports"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/calendar",isAuthenticated, function(req, res){
		res.render("calendar-events",{
			title: "IIM JOBS | Calendar Events",
			styles:  assetsMapper["calendar-events"]["styles"][mode],
			scripts: assetsMapper["calendar-events"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/slots/:calendarID",isAuthenticated, function(req, res){
		res.render("manage-calendar",{
			title: "IIM JOBS | Manage Calendar",
			styles:  assetsMapper["manage-calendar"]["styles"][mode],
			scripts: assetsMapper["manage-calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/slots",isAuthenticated, function(req, res){

		res.render("manage-calendar",{
			title: "IIM JOBS | Manage Calendar",
			styles:  assetsMapper["manage-calendar"]["styles"][mode],
			scripts: assetsMapper["manage-calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/view-booked-slots",isAuthenticated, function(req, res){

		res.render("view-booked-slots",{
			title: "IIM JOBS | View Booked Slots",
			styles:  assetsMapper["view-booked-slots"]["styles"][mode],
			scripts: assetsMapper["view-booked-slots"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/myChat",isAuthenticated, function(req, res) {
		console.log(req.isNew);
		res.render("chat",{
			title: "IIM JOBS | myChat",
			styles:  assetsMapper["chat"]["styles"][mode],
			scripts: assetsMapper["chat"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/recruiter-plan",isAuthenticated, function(req, res){

		res.render("premium-posting", {
			title: "IIM JOBS | Premium Posting",
			styles:  assetsMapper["premium-posting"]["styles"][mode],
			scripts: assetsMapper["premium-posting"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	})

	app.get("/recruiter/my-profile",isAuthenticated, function(req, res){

		res.render("my-profile",{
			title: "IIM JOBS | My Profile",
			styles:  assetsMapper["my-profile"]["styles"][mode],
			scripts: assetsMapper["my-profile"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/edit-profile",isAuthenticated, function(req, res){

		res.render("edit-profile",{
			title: "IIM JOBS | Edit Profile",
			styles:  assetsMapper["edit-profile"]["styles"][mode],
			scripts: assetsMapper["edit-profile"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/profile-view",isAuthenticated, function(req, res){

		res.render("profile-view",{
			title: "IIM JOBS | Profile View",
			styles:  assetsMapper["profile-view"]["styles"][mode],
			scripts: assetsMapper["profile-view"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/export-profile",isAuthenticated, function(req, res){

		res.render("export-profile",{
			title: "IIM JOBS | Export Profile",
			styles:  assetsMapper["export-profile"]["styles"][mode],
			scripts: assetsMapper["export-profile"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/tags",isAuthenticated, function(req, res){

		res.render("tags",{
			title: "IIM JOBS | Tags",
			styles:  assetsMapper["tags"]["styles"][mode],
			scripts: assetsMapper["tags"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/filter-candidate",isAuthenticated, function(req, res){

		res.render("filter-candidate",{
			title: "IIM JOBS | Filter Candidate",
			styles:  assetsMapper["filter-candidate"]["styles"][mode],
			scripts: assetsMapper["filter-candidate"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/change-password", function(req, res){

		res.render("change-password", {
			title: "IIM JOBS | Change Password",
			styles:  assetsMapper["change-password"]["styles"][mode],
			scripts: assetsMapper["change-password"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/landing", function(req, res){

		res.render("account-activation", {
			title: "IIM JOBS | Account Activation",
			styles:  assetsMapper["account-activation"]["styles"][mode],
			scripts: assetsMapper["account-activation"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/mass-resume-status",isAuthenticated, function(req, res){

		res.render("mass-resume", {
			title: "IIM JOBS | Mass Resume",
			styles:  assetsMapper["mass-resume"]["styles"][mode],
			scripts: assetsMapper["mass-resume"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/reset", function(req, res){

		res.render("reset-password", {
			title: "IIM JOBS | Reset Password",
			styles:  assetsMapper["reset-password"]["styles"][mode],
			scripts: assetsMapper["reset-password"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/pdf", function(req, res){

		res.render("pdfTest", {
			title: "IIM JOBS | Reset Password",
			styles:  assetsMapper["pdfTest"]["styles"][mode],
			scripts: assetsMapper["pdfTest"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/pdfIframe", function(req, res){

		res.render("pdfIframe", {
			title: "IIM JOBS | Reset Password",
			styles:  assetsMapper["pdfIframe"]["styles"][mode],
			scripts: assetsMapper["pdfIframe"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/ui_components", function(req, res){

		res.render("ui_components", {
			title: "Recruiter Web - UI Components | iimjobs.com",
			styles:  assetsMapper["ui-components"]["styles"][mode],
			scripts: assetsMapper["ui-components"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	})

	app.get("/my-jobs", function(req,res){
		res.render("my-jobs", {
			title:"Recruiter Web - My Jobs | iimjobs.com",
			styles:  assetsMapper["my-jobs"]["styles"][mode],
			scripts: assetsMapper["my-jobs"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/settings", function(req,res){
		res.render("settings", {
			title:"Recruiter Web - Settings | iimjobs.com",
			styles:  assetsMapper["settings"]["styles"][mode],
			scripts: assetsMapper["settings"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/tagged-candidates", function(req,res){
		res.render("tagged-candidates", {
			title:"Recruiter Web - Tagged Candidates | iimjobs.com",
			styles:  assetsMapper["tagged-candidates"]["styles"][mode],
			scripts: assetsMapper["tagged-candidates"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/shortlisted-candidates", function(req,res){
		res.render("shortlisted-candidates", {
			title:"Recruiter Web - Shortlisted Candidates | iimjobs.com",
			styles:  assetsMapper["shortlisted-candidates"]["styles"][mode],
			scripts: assetsMapper["shortlisted-candidates"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/candidate-apply-list", function(req,res){
		res.render("candidate-apply-list", {
			title:"Recruiter Web - Candidate Apply List | iimjobs.com",
			styles:  assetsMapper["candidate-apply-list"]["styles"][mode],
			scripts: assetsMapper["candidate-apply-list"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/my-chat", function(req,res){
		res.render("my-chat", {
			title:"Recruiter Web - My Chat | iimjobs.com",
			styles:  assetsMapper["my-chat"]["styles"][mode],
			scripts: assetsMapper["my-chat"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/reports", function(req,res){
		res.render("reports", {
			title:"Recruiter Web - Reports | iimjobs.com",
			styles:  assetsMapper["reports"]["styles"][mode],
			scripts: assetsMapper["reports"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});
	
	app.get("/landing", function(req,res){
		res.render("landing", {
			title:"Recruiter Web - Landing Page | iimjobs.com",
			styles:  assetsMapper["landing"]["styles"][mode],
			scripts: assetsMapper["landing"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});
}
