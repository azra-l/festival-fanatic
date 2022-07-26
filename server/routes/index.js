var express = require("express");
var router = express.Router();
var request = require("request"); // "Request" library
var md5 = require("md5");
var axios = require("axios");

const User = require("../models/User");
const Festival = require("../models/Festival");
const SpotifyImports = require("../models/SpotifyImports");
const Artist = require("../models/Artist");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

var stateKey = "spotify_auth_state";

router.get("/login", function (req, res, next) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = "user-read-private user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    }).toString()
  );
});

router.get("/callback", async function (req, res, next) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
      new URLSearchParams({
        error: "state_mismatch",
      }).toString()
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };
        // https://blog.logrocket.com/how-to-secure-react-app-login-authentication/
        // https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

        let hashedId;
        // use the access token to access the Spotify Web API


        // get user's top artists

        let topArtists;

        try {
          const userDetailsResponse = await axios.get(
            "https://api.spotify.com/v1/me",
            {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            }
          );

          if (userDetailsResponse.status === 200) {

            // Successfully logged in
            hashedId = md5(userDetailsResponse.data.id);
            

            // Set user's session
            req.session.user = {
              access_token: access_token,
              refresh_token: refresh_token,
              userId: hashedId,
            }
            console.log("successfully logged in")

            

            topArtists = await getSpotifyTopArtists(access_token);
            const { artistEventRequestArray, listOfArtists } = topArtists;
            
            const artistPromises = [];
            for (const artist of listOfArtists) {
              artistPromises.push(Artist.findOneAndUpdate({ 
                spotify_id: artist.id
               }, { 
                spotify_id: artist.id,
                name: artist.name,
                href: artist.href
               }, {
                upsert: true,
                new: true
               }));
            }
            
            const artists = await Promise.all(artistPromises);

            const user = await User.findOneAndUpdate({ userId: hashedId }, 
              {
                userId: hashedId
              }, {
              new: true,
              upsert: true,
            });
            
            const currentSpotifyImports = new SpotifyImports({
              userId: user.userId,
              timeOfImport: new Date(),
              spotifyImports: listOfArtists.map((e) => ({
                artistRef: artists.find((artist) => artist.spotify_id === e.id)?._id,
                ...e
              })),
            });

            await currentSpotifyImports.save();
            
            user.selectedArtists = artists.map((e) => e._id);
            await user.save();
            
            const festivalResults = await getBandsInTownEvents(
              artistEventRequestArray,
              artists
            );

            const festivals = parseFestivalResults(
              festivalResults.eventsList
            );


            for (const festival of festivals) {
              await Festival.findOneAndUpdate({
                  id: festival.id,
                },
                festival, {
                  upsert: true
                }
              );
            }
          }
        } catch (e) {
          console.log(e);
        }

        // we can also pass the token to the browser to make requests from there
        res.redirect("http://localhost:3000/results");
      } else {
        res.redirect(
          "/#" +
          new URLSearchParams({
            error: "invalid_token",
          }).toString()
        );
      }
    });
  }
});

const getSpotifyTopArtists = async (access_token) => {
  let artistEventRequestArray = [];
  let listOfArtists = [];

  if (process.env.MOCK_SPOTIFY_DATA === 'true') {
    const spotifyResponse = require('../mock-spotify-top-artists-data.json');

    artistEventRequestArray = spotifyResponse.map(
      (artist) =>
        `https://rest.bandsintown.com/artists/${artist.name}/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`
    );

    listOfArtists = spotifyResponse;

    return { artistEventRequestArray, listOfArtists };
  }

  try {
    const spotifyResponse = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    if (spotifyResponse.status === 200) {
      artistEventRequestArray = spotifyResponse.data.items.map(
        (artist) =>
          `https://rest.bandsintown.com/artists/${artist.name}/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`
      );

      listOfArtists = spotifyResponse.data.items.map((artist) => ({
        name: artist.name,
        spotify_id: artist.id,
      }));

      return { artistEventRequestArray, listOfArtists };
    }
  } catch (e) {
    throw new Error(e);
  }
};

const getBandsInTownEvents = async (artistEventRequestArray, listOfArtists) => {
  try {
    const result = await Promise.allSettled(
      artistEventRequestArray.map((request) => {
        return axios
          .get(request)
          .then((response) => {
            return response.data;
          })
          .then((data) => {
            return data;
          });
      })
    );

    let failedToFindArtistList = [];
    let eventsList = [];

    result.forEach((promise, index) => {
      if (promise.status == "rejected") {
        failedToFindArtistList.push(listOfArtists[index]);
      } else if (promise.status == "fulfilled") {
        promise.value.forEach((eventValue) => {
          const foundEvent = eventsList.find(
            (eventInCurrentList) =>
              eventInCurrentList.title === eventValue.title
          );
          if (foundEvent) {
            if (
              !foundEvent.lineup.find((element) => {
                return (
                  element.name.toLowerCase() ===
                  listOfArtists[index].name.toLowerCase()
                );
              })
            )
              foundEvent.lineup.push(listOfArtists[index]);
          } else {
            eventValue.lineup = [listOfArtists[index]];
            delete eventValue.artist;
            eventsList.push(eventValue);
          }
        });
      }
    });

    console.log(
      `Failed to find artists ${JSON.stringify(
        failedToFindArtistList.map((artist) => artist.name)
      )}`
    );

    const finalObject = {
      eventsList: eventsList,
      failedToFindArtistList: failedToFindArtistList,
    };

    return finalObject;
  } catch (e) {
    throw new Error(e);
  }
};

const parseFestivalResults = (results) => {
  const festivals = results.map((result) => {
    const { lineup } = result;

    const artists = lineup.map((artist) => artist._id);

    const festival = {
      id: result.id,
      date: result.datetime,
      name: result.title === "" ? result.venue.name : result.title,
      city: result.venue.city,
      region: result.venue.region,
      country: result.venue.country,
      venue: result.venue.name,
      latitude: result.venue.latitude,
      longitude: result.venue.longitude,
      saved: false,
      archived: false,
      tickets: result.offers[0] ? result.offers[0].url : "",
      link: result.url,
      artists: artists,
    };
    return festival;
  });

  return festivals;
};

router.get("/checkcookie", function (req, res, next) {
  try {
    // const data = jwt.verify(token, "YOUR_SECRET_KEY");

    const token = req.session.user;
    console.log("The req session", req.session.user);
    if (!token) {
      return res.sendStatus(403);
    }
    console.log("The session is ", req.session);
    return res.status(200).json({
      message: "Your token is valid",
      cookie: req.session,
    });
    // Almost done
  } catch {
    return res.sendStatus(403);
  }
});

router.get('/logout', function (req, res, next) {

  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ message: "You can check out anytime you like but you can never leave" })
      } else {
        // res.status(200).json({ message: "Successfully logged out" })
        res.redirect("http://localhost:3000");

      }
    })

  } else {
    res.status(200).json({ message: "Not logged in, no session to DESTROYY" })

    // const token = req.cookies.access_token;
    res.redirect("http://localhost:3000");
  }


});

module.exports = router;
