const shareJob = require('./shareJob.js');

module.exports = function(settings) {
    const app = settings["app"];
    const querystring = require('querystring');
    const passport = settings["passport"];
    var request = settings["request"];
    var config = settings["config"];
    var env = settings.env;

    if(env=="local")
        baseUrl= config["baseUrl_local"];
    else
        baseUrl = config["baseUrl"];

    app.get('/auth/linkedin', function(req, res) {
        console.log(req.query);

        var stateParam = config['social']['linkedin']['stateKey'] + "?Page=" + req.query["page"] + "&jobId=" + req.query["jobId"] + "&id=" + req.query["id"] + "";
        stateParam = Buffer.from(stateParam).toString('base64')
        passport.authorize('linkedin-auths', {
            state: stateParam,
            scope: ['r_emailaddress', 'r_basicprofile', 'w_share']
        })(req, res);
    });

    app.get('/auth/linkedin/callback', function(req, res, next) {
        const state = req.query.state;
        var err = req.query.error_description;
        var buff = new Buffer(state, 'base64');
        var text = buff.toString('ascii');
        var token = text.substring(0, text.indexOf("?"));
        text = text.substring(text.indexOf("?") + 1);
        var param = querystring.parse(text);
        req.param = param;
        if (param['Page'] == "jobs") {
            if (!(err)) {
                config['social']['linkedin']['successRedirect'] = "/" + param['Page'] + "?jobId=" + param['jobId'];
            } else {
                res.redirect(config['social']['linkedin']['successRedirect'] = "/" + param['Page'] + "?error=" + err);
            }
        }
        if (err) {
            res.send('<script>window.close()</script>');
        }
        if (token != config['social']['linkedin']['stateKey']) {
            return res.redirect(config['social']['linkedin']['failureRedirect']);
        }
        return next();
    }, passport.authorize('linkedin-auths', {
        failureRedirect: config['social']['linkedin']['failureRedirect'],
    }), function(req, res) {
        var data = {};
        data.platform = "linkedin";
        jobShareSocial(req.param['id'], req.param['jobId'], data);
        return res.redirect(config['social']['linkedin']['successRedirect'])
    })

    app.get('/auth/twitter', function(req, res, next) {
        var stateParam = config['social']['linkedin']['stateKey'];
        var cbURL = config['social']['twitter']['callbackURL'];
        if(req.query['page']){
            var state = 'stateKey='+ stateParam+ '&page='+req.query["page"] + '&jobId='+req.query['jobId']+ '&id='+req.query["id"]+ "&popup="+req.query["popup"];
            const base64EncodedState = Buffer.from(state).toString('base64');
            cbURL+= "?state="+base64EncodedState;
        }
        passport.authorize('twitter-auths', {
            callbackURL: cbURL
        })(req, res, next);
    });

    app.get('/auth/twitter/callback', function(req, res, next) {
        var state = req.query.state || null;
        var param = {};
        if(state){
            state=Buffer.from(state, 'base64').toString('ascii');
            var param = querystring.parse(state);
        }
        var stateKey = param['stateKey'];
        var page = param['page'];
        var jobID = param['jobId'];
        var popup= param['popup']

        // if (page == 'jobs') {
        //     config['social']['twitter']['successRedirect'] = "/" + page + "?jobId=" + jobID + "";

        //     if (req.query.denied) {
        //         config['social']['twitter']['successRedirect'] = "/" + page + "";
        //         return res.redirect(config['social']['twitter']['successRedirect'])
        //     }
        // }

        // if (req.query.denied) {
        //     res.send('<script>window.close()</script>');
        // }
        if (stateKey != config['social']['twitter']['stateKey']) {
            return res.redirect(config['social']['twitter']['failureRedirect']);
        }
        passport.authorize('twitter-auths', function(err, user, info){
            console.log('...........err')
            console.log(err)
            console.log('...........user')
            console.log(user)
            console.log('...........info')
            console.log(info);

            if(req.query.denied && popup=='yes')
                return res.send('<script>window.close()</script>');
            if(!user){
                return res.send('Sorry, we could not auhenticate you at this moment. Our engineers our working on fixing this. Please try again after sometime')
            }
            // if successful and initiated via popup
            if(popup=='yes'){
                return  res.redirect(config['social']['twitter']['successRedirect']);
            }
            // if successful and initiated by whole page
            if(page)
                return res.redirect(page);
            return res.redirect(config['social']['twitter']['successRedirect']);
        })(req, res, next);
    })

    // {
    //     failureRedirect: config['social']['twitter']['failureRedirect']
    // }), function(req, res) {
    //     console.log('here');
    //     console.log(req);
    //     return res.redirect(config['social']['twitter']['successRedirect'])
    // });


    //  app.get('/auth/facebook', passport.authenticate('facebook',{ authType: 'rerequest',scope: configuration["facebook"]["scope"]}));


    // app.get('/auth/facebook/callback',
    //   passport.authenticate('facebook', { successRedirect: '/?loginAttempt=success&target=fb',
    //                                       failureRedirect: '/?loginAttempt=fail&target=fb' }));  

    app.get('/logout', function(req, res) {
        console.log('..logging out...')
        req.logout();
        res.redirect('/')
    });
    // app.get('/auth/google',
    //   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
    //     'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

    // app.get('/auth/google/callback', 
    //   passport.authenticate('google', { failureRedirect: '/?loginAttempt=fail&target=google' }),
    //   function(req, res) {
    //     res.redirect('/?loginAttempt=success&target=google');
    // });


};