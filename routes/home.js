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
	var baseUrl =  config["baseUrl"];
	if(env=="local")
		baseUrl= config["baseUrl_local"];
	else
		baseUrl = config["baseUrl"];
	function isAuthenticated(req, res, next) {
		console.log(req.session);
		// for disabling authentication
		//return next()
		//bypassing the auth for development
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    	if (req.session.authenticated)
        	return next();
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE


    	res.redirect('/sign-in');
	}
	app.post("/sign-in", function(req, res){
		var id = req.body.id || null;
		if(!id){
			res.status(422).json({
				status: 'fail',
				message: 'missing parameters'
			});
			return
		}

		req.session.authenticated = true;
		return res.json({
			status: "success"
		});
	})
	app.get("/", isAuthenticated,function(req, res){
		res.render("index", {
			title: "IIM JOBS | Dashboard",
			styles:  assetsMapper["index"]["styles"][mode],
			scripts: assetsMapper["index"]["scripts"][mode],
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



	app.get("/post-job", function(req, res){
		res.render("post-job",{
			title: "IIM JOBS | Post job",
			styles:  assetsMapper["post-job"]["styles"][mode],
			scripts: assetsMapper["post-job"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/job/:jobID/candidates", function(req, res){
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

	app.get("/profile/:userID", function(req, res){
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

	app.get("/calendar", function(req, res){
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

	app.get("/view-reports", function(req, res){
		res.render("view-reports",{
			title: "IIM JOBS | View Reports",
			styles:  assetsMapper["view-reports"]["styles"][mode],
			scripts: assetsMapper["view-reports"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/calendar", function(req, res){
		res.render("calendar-events",{
			title: "IIM JOBS | Calendar Events",
			styles:  assetsMapper["calendar-events"]["styles"][mode],
			scripts: assetsMapper["calendar-events"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/slots/:calendarID", function(req, res){
		res.render("manage-calendar",{
			title: "IIM JOBS | Manage Calendar",
			styles:  assetsMapper["manage-calendar"]["styles"][mode],
			scripts: assetsMapper["manage-calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/slots", function(req, res){

		res.render("manage-calendar",{
			title: "IIM JOBS | Manage Calendar",
			styles:  assetsMapper["manage-calendar"]["styles"][mode],
			scripts: assetsMapper["manage-calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/view-booked-slots", function(req, res){

		res.render("view-booked-slots",{
			title: "IIM JOBS | View Booked Slots",
			styles:  assetsMapper["view-booked-slots"]["styles"][mode],
			scripts: assetsMapper["view-booked-slots"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/myChat", function(req, res){

		res.render("chat",{
			title: "IIM JOBS | myChat",
			styles:  assetsMapper["chat"]["styles"][mode],
			scripts: assetsMapper["chat"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

}
