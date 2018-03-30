module.exports = function(settings){
  const	app=settings["app"];
	const passport = settings["passport"];
	config = settings["config"];
  app.get('/auth/linkedin', passport.authorize('linkedin-auths', {state: config['social']['linkedin']['stateKey']}), function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  })
  app.get('/auth/linkedin/callback', function(req, res, next){
    const state = req.query.state;
    if(state != config['social']['linkedin']['stateKey'] )
      return res.redirect(config['social']['linkedin']['failureRedirect']);
    return next();
  },passport.authorize('linkedin-auths', {
    failureRedirect: config['social']['linkedin']['failureRedirect'],
    failureFlash: true
  }),
  function(req, res){
    return res.redirect(config['social']['linkedin']['successRedirect'])
  })
// 	app.get('/auth/facebook', passport.authenticate('facebook',{ authType: 'rerequest',scope: configuration["facebook"]["scope"]}));


// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/?loginAttempt=success&target=fb',
//                                       failureRedirect: '/?loginAttempt=fail&target=fb' }));	

app.get('/logout', function(req, res){
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