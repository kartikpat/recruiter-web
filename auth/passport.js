var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
require("../static/js/request.js");
var facebookUserProfileUrl;
var linkedInUserProfileUrl;
var url = {}

module.exports = function(settings) {

    var passport = settings.passport;
    var config = settings.config;
    var request = settings.request;
    var fs = settings.fs;

    passport.use(new FacebookStrategy({

	       // pull in our app id and secret from our auth.js file
	       clientID        : config.facebookAuth.clientID,
	       clientSecret    : config.facebookAuth.clientSecret,
	       callbackURL     : config.facebookAuth.callbackURL

	   },
	   // facebook will send back the token and profile
	   function(token, refreshToken, profile, done) {
           console.log(token)
           console.log(profile);
           var id = profile.id;
           //localStorage.facebookserId = id;
           console.log(id);
           const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
        //    getRequest("https://graph.facebook.com/v2.8/"+id+"" ,{
        //         }, function(res) {
        //            console.log(res);
        //        })
        //        const request = require('request');

            const options = {
                url: "https://graph.facebook.com/v2.8/"+id+"",
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8',
                    'User-Agent': 'my-reddit-client'
                },
                qs: {
                    access_token: token,
                    fields: userFieldSet
                }
            };

            request(options, function(err, res, body) {

                let json = JSON.parse(body);

                facebookUserProfileUrl = json.link;

                fs.writeFile('facebookUrl.json', facebookUserProfileUrl, function(err) {
                    // throws an error, you could also catch it here
                    if (err) {
                        return console.log(err);
                    }

                    // success case, the file was saved
                    console.log('facebook url saved!');
                });
                console.log(json);
            });




            // const postTextOptions = {
            //   method: 'POST',
            //   uri: "https://graph.facebook.com/v2.8/"+id+"/feed",
            //   qs: {
            //     access_token: token,
            //     message: 'Hello world!'
            //   }
            // };
            // request(postTextOptions);
           user = {}
	       return done(null, user);

	   }));

       passport.use(new TwitterStrategy({
           consumerKey: config.twitterAuth.clientID,
           consumerSecret: config.twitterAuth.clientSecret,
           callbackURL: config.twitterAuth.callbackURL
       },
          function(token, tokenSecret, profile, done) {
              console.log(token);
              console.log(profile);
            user = {}
            return done(null, user);

          }
      ));

      passport.use(new LinkedInStrategy({
        clientID: config.linkedinAuth.clientID,
        clientSecret: config.linkedinAuth.clientSecret,
        callbackURL: config.linkedinAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
          console.log(accessToken);

          linkedInUserProfileUrl = profile._json.publicProfileUrl;


          fs.writeFile('linkedinUrl.json', linkedInUserProfileUrl, function (err) {
              // throws an error, you could also catch it here
              if (err) {
                  return console.log(err);
              }

              // success case, the file was saved
              console.log('linkedin url saved!');
          });

        //   const option = {
        //        url: "https://api.linkedin.com/v1/people/~:(pictureUrl,public-profile-url)?format=json",
        //        method: 'GET',
        //        headers: {
        //            'Accept': 'application/json',
        //            'Accept-Charset': 'utf-8'
        //        },
        //        qs: {
        //            oauth2_access_token: accessToken
        //        }
        //    };
          //
        //    request(option, function(err, res, body) {
          //
        //        let json = JSON.parse(body);
        //        //localStorage.facebookUserProfileUrl = json.link;
        //        console.log(json);
        //    });
          //


        //  var jso = {
        //     "comment": "Check out developer.linkedin.com! http://linkd.in/1FC2PyG",
        //           "visibility": {
        //             "code": "anyone"
        //           }
        //     }
         //
        //     // LinkedInStrategy._oauth2.setAccessTokenName("token");
         //
        //   const options = {
        //       url: "https://api.linkedin.com/v1/people/~/shares?oauth2_access_token=AQUOPKBbiJDGZg52TfF5PVGeajMY4yUApXm54zmjXU8rcFgM5gPgsra6tXJq4nVQAuNtS1NE01Fh5GiGhIR1SUkVHnKmEeC5HoLZ0VKslrHsaBybOuvM6Ic2pOqjapjsvzukkj79mL78ypSUcWoca8BLxdNrKePUvJT1qwV_OkYF2vcJGnCyIvJ5M4LVoCfUEUFXZYQZQSb8h-68N1gCbPXuvRaWEFfjHrt2Fr5Mpx2rRoTwfs6RkzpIvXAR-FfKDssWVrWao5xz324fTMRVRXmuLbrgg1RvLd8alktwy63o8iQ9jsbh7HdpFvCS9wugtohOvDaoMM_0u1VaTzntEllbGJ4kYQ&format=json",
        //       method: 'POST',
        //       headers: {
        //           'Content-Type': 'application/json',
        //           'x-li-format': 'json'
        //      },
        //      body: jso,
        //      json: true
        //   };
         //
        //   request(options, function(err, res, body) {
        //       console.log(body);
         //
        //   });

          user = {}
          return done(null, user);

      }
    ));

   }
