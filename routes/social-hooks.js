const shareJob = require('./shareJob.js');
const getTokenAndPost = require('./getTokenAndPost.js');
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
        var stateParam = config['social']['linkedin']['stateKey'];
        var state = 'stateKey='+ stateParam;
        if(req.query['page']){
            state+= '&page='+req.query["page"] + '&jobId='+req.query['jobId']+ '&id='+req.query["id"]+ "&popup="+req.query["popup"];
        }
        const base64EncodedState = Buffer.from(state).toString('base64');

        passport.authorize('linkedin-auths', {
            state: base64EncodedState,
            scope: ['r_emailaddress', 'r_basicprofile', 'w_share']
        })(req, res);
    });

    app.get('/auth/linkedin/callback', function(req, res, next) {
        var state = req.query.state || null;
        var param = {};
        if(state){
            state=Buffer.from(state, 'base64').toString('ascii');
            var param = querystring.parse(state);
        }
        var stateKey = param['stateKey'];
        var page = param['page'];
        var jobId = param['jobId'];
        var popup= param['popup'];
        var recruiterId = param['id'];
        var accessToken = req.cookies[config["cookie"]];

        if (stateKey != config['social']['linkedin']['stateKey']) {
            return res.redirect(config['social']['linkedin']['failureRedirect']);
        }
        passport.authorize('linkedin-auths', async function(err, user, info){
            console.log('...........err')
            console.log(err)
            console.log('...........user')
            console.log(user)
            console.log('...........info')
            console.log(info);

            console.log(req.query)
            if(err && err.code!='user_cancelled_login' && err.code !=="user_cancelled_authorize"){
                return res.send('Sorry, we could not auhenticate you at this moment. Our engineers our working on fixing this. Please try again after sometime');
            };
            if(popup == 'yes'){
                if(req.query.error=='user_cancelled_login' || req.query.error=='user_cancelled_authorize')
                    return res.send('<script>window.close()</script>');
                return res.redirect(config['social']['linkedin']['successRedirect']);    
            }

            if(req.query.error=='user_cancelled_login' || req.query.error=='user_cancelled_authorize'){
                if(page)
                    return res.redirect(page);;
                return res.redirect(config['social']['linkedin']['failureRedirect']);
            }

            if(jobId){
                try{
                    await getTokenAndPost(recruiterId, 'linkedin', accessToken, jobId, baseUrl );
                }catch(err){
                    if(err==400)
                        return res.redirect(page+'?share=fail&code=400')
                    if(err==409)
                        return res.redirect(page+'?share=fail&code=409')
                    return res.redirect(page+'?share=fail')
                }
                return res.redirect(page+'?share=success');
            }
            // if successful and initiated by whole page
            if(page)
                return res.redirect(page);
            return res.redirect(config['social']['twitter']['successRedirect']);
        })(req, res, next);

    })

    app.get('/auth/twitter', function(req, res, next) {
        var stateParam = config['social']['twitter']['stateKey'];
        var state = 'stateKey='+ stateParam;
        var cbURL = config['social']['twitter']['callbackURL'];
        if(req.query['page']){
            state+= '&page='+req.query["page"] + '&jobId='+req.query['jobId']+ '&id='+req.query["id"]+ "&popup="+req.query["popup"];
        }
        const base64EncodedState = Buffer.from(state).toString('base64');
        cbURL+= "?state="+base64EncodedState;
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
        var jobId = param['jobId'];
        var popup= param['popup'];
        var recruiterId = param['id'];
        var accessToken = req.cookies[config["cookie"]];

        if (stateKey != config['social']['twitter']['stateKey']) {
            return res.redirect(config['social']['twitter']['failureRedirect']);
        }
        passport.authorize('twitter-auths', async function(err, user, info){
            console.log('...........err')
            console.log(err)
            console.log('...........user')
            console.log(user)
            console.log('...........info')
            console.log(info);

            console.log(req.query)
            if(err){
                return res.send('Sorry, we could not auhenticate you at this moment. Our engineers our working on fixing this. Please try again after sometime');
            };
            if(popup == 'yes'){
                if(req.query.denied)
                    return res.send('<script>window.close()</script>');
                return res.redirect(config['social']['twitter']['successRedirect']);    
            }

            if(req.query.denied){
                if(page)
                    return res.redirect(page);;
                return res.redirect(config['social']['twitter']['failureRedirect']);
            }
            if(jobId){
                try{
                    await getTokenAndPost(recruiterId, 'twitter', accessToken, jobId, baseUrl );
                }catch(err){
                    if(err==400)
                        return res.redirect(page+'?share=fail&code=400')
                    if(err==409)
                        return res.redirect(page+'?share=fail&code=409')
                    return res.redirect(page+'?share=fail')
                }
                return res.redirect(page+'?share=success');
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