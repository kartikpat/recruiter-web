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
	function isAuthenticated(req, res, next) {

		// for disabling authentication
		return next()
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
		res.render("postjob",{
			title: "IIM JOBS | Post job",
			styles:  assetsMapper["postjob"]["styles"][mode],
			scripts: assetsMapper["postjob"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/job-posting", function(req, res){
		res.render("job-posting",{
			title: "IIM JOBS | Post job",
			styles:  assetsMapper["job-posting"]["styles"][mode],
			scripts: assetsMapper["job-posting"]["scripts"][mode],
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
}
