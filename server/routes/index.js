var express = require('express');
var router = express.Router();
var request = require('request'); // "Request" library

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

var stateKey = 'spotify_auth_state';

router.get('/login', function (req, res, next) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }).toString());
});

router.get('/callback', function (req, res, next) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      new URLSearchParams({
        error: 'state_mismatch'
      }).toString());
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        // https://blog.logrocket.com/how-to-secure-react-app-login-authentication/
        // https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn


        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        console.log(access_token)


        const cookieOptions = {
          // TODO: Enable it in production
          httpOnly: true,
          secure: true
          // secure: process.env.NODE_ENV === "production",
        };

        res.cookie('festivalFanatic', {
          access_token: access_token,
          refresh_token: refresh_token
        }, cookieOptions)


        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/'


        );
      } else {
        res.redirect('/#' +
          new URLSearchParams({
            error: 'invalid_token'
          }).toString());
      }
    });
  }
});

router.get('/checkcookie', function (req, res, next) {


  try {
    // const data = jwt.verify(token, "YOUR_SECRET_KEY");

    const token = req.cookies.festivalFanatic.access_token;
    console.log("The req cookie", req.cookies.festivalFanatic.access_token)
    if (!token) {
      return res.sendStatus(403);
    }
    console.log("The cookies are ", req.cookies.festivalFanatic)
    return res.status(200).json({ message: "Your token is valid", cookie: req.cookies.festivalFanatic })
    // Almost done
  } catch {
    return res.sendStatus(403);
  }

});

router.get('/logout', function (req, res, next) {


  res.clearCookie("festivalFanatic")


  // const token = req.cookies.access_token;
  res.redirect('https://accounts.spotify.com/en/logout')
});




module.exports = router;
