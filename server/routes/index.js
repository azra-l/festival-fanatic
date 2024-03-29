var express = require("express");
var router = express.Router();
var request = require("request");
var md5 = require("md5");
var axios = require("axios");

const User = require("../models/User");
const Festival = require("../models/Festival");
const SpotifyImports = require("../models/SpotifyImports");
const Artist = require("../models/Artist");
const fs = require("fs");
const clientUrl = process.env.CLIENT_URL;

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
        // adapted from: https://blog.logrocket.com/how-to-secure-react-app-login-authentication/
        // and https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

        let hashedId;

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
            hashedId = md5(userDetailsResponse.data.id);
            req.session.user = {
              access_token: access_token,
              refresh_token: refresh_token,
              userId: hashedId,
            };
            console.log("successfully logged in");

            const user = await User.findOneAndUpdate(
              { userId: hashedId },
              {
                userId: hashedId,
              },
              {
                new: true,
                upsert: true,
              }
            );

            const currentSpotifyImports = await SpotifyImports.find({
              userId: user.userId,
            })
              .sort({ timeOfImport: -1 })
              .limit(1);
            if (
              currentSpotifyImports.length > 0 &&
              new Date().getTime() -
                currentSpotifyImports[0].timeOfImport.getTime() <
                24 * 60 * 60 * 1000
            ) {
              throw new Error(
                "no need to update imports, last import was done less than a day ago"
              );
            }

            topArtists = await getSpotifyTopArtists(access_token);
            const listOfArtists = topArtists;

            const artists = await addOrUpdateArtistsFromSpotify(
              listOfArtists,
              user
            );

            user.selectedArtists = artists.map((e) => e._id);
            await user.save();

            const festivalResults = await getBandsInTownEvents(artists);

            const festivals = parseFestivalResults(festivalResults.eventsList);

            for (const festival of festivals) {
              await Festival.findOneAndUpdate(
                {
                  name: festival.name,
                  date: festival.date,
                },
                festival,
                {
                  upsert: true,
                }
              );
            }
          }
        } catch (e) {
          console.log(e);
        }
        res.redirect(`${clientUrl}/results`);
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
  if (process.env.MOCK_API_DATA === "true") {
    return require("../mock-spotify-top-artists-data.json");
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
      return spotifyResponse.data.items;
    }
  } catch (e) {
    throw new Error(e);
  }
};

const getBandsInTownEvents = async (listOfArtists) => {
  try {
    let result;
    if (process.env.MOCK_API_DATA === "true") {
      const mockData = require("../mock-bandintown-festival-data.json");
      result = await Promise.allSettled(
        listOfArtists.map(async (artist) => {
          const data = mockData[artist.name];
          if (data) return data;
          throw new Error("no events found for artist");
        })
      );
    } else {
      result = await Promise.allSettled(
        listOfArtists.map(async (artist) => {
          const request = `https://rest.bandsintown.com/artists/${artist.name}/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`;
          const response = await axios.get(request);
          return response.data;
        })
      );
    }

    let failedToFindArtistList = [];
    let eventsList = [];

    result.forEach((promise, index) => {
      if (promise.status == "rejected") {
        failedToFindArtistList.push(listOfArtists[index]);
      } else if (promise.status == "fulfilled") {
        promise.value.forEach((bandsInTownEvent, index2) => {
          // Find any events that are already present based on the event name and datetime
          // If it exists, the artist to it's lineup, otherwise create a new event
          // Some event "title"'s are blank, so need to error handle for that and replace with "venue.name"
          const existingEvent = eventsList.find((eventInCurrentList) => {
            const eventInCurrentListTitle =
              eventInCurrentList.title === ""
                ? eventInCurrentList.venue.name
                : eventInCurrentList.title;

            const queryEventTitle =
              bandsInTownEvent.title === ""
                ? bandsInTownEvent.venue.name
                : bandsInTownEvent.title;

            return (
              eventInCurrentListTitle === queryEventTitle &&
              eventInCurrentList.datetime === bandsInTownEvent.datetime
            );
          });

          if (typeof existingEvent !== "undefined") {

            const existingLineup = existingEvent.lineup.find((element) => {
              return (
                element.name.toLowerCase() ===
                listOfArtists[index].name.toLowerCase()
              );
            });

            if (typeof existingLineup === "undefined")
              existingEvent.lineup.push(listOfArtists[index]);
          } else {
            bandsInTownEvent.lineup = [listOfArtists[index]];
            delete bandsInTownEvent.artist;
            eventsList.push(bandsInTownEvent);
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
      tickets: result.offers[0] ? result.offers[0].url : "",
      link: result.url,
      $addToSet: { artists: { $each: artists } },
      description: result.description,
    };
    return festival;
  });

  return festivals;
};


router.get("/logout", function (req, res, next) {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({
          message: "You can check out anytime you like but you can never leave",
        });
      } else {
        res.redirect(clientUrl);
      }
    });
  } else {
    res.status(200).json({ message: "Not logged in, no session to DESTROYY" });
    res.redirect(clientUrl);
  }
});

module.exports = router;

async function addOrUpdateArtistsFromSpotify(listOfArtists, user) {
  const artistPromises = [];
  for (const artist of listOfArtists) {
    artistPromises.push(
      Artist.findOneAndUpdate(
        {
          spotify_id: artist.id,
        },
        {
          spotify_id: artist.id,
          name: artist.name,
          href: artist.external_urls.spotify,
          image: artist.images ? artist.images[0].url : null,
        },
        {
          upsert: true,
          new: true,
        }
      )
    );
  }

  const artists = await Promise.all(artistPromises);

  const newSpotifyImports = new SpotifyImports({
    userId: user.userId,
    timeOfImport: new Date(),
    spotifyImports: listOfArtists.map((e) => ({
      artistRef: artists.find((artist) => artist.spotify_id === e.id)?._id,
      ...e,
    })),
  });

  await newSpotifyImports.save();
  return artists;
}

router.post("/new-selected-artists", async function (req, res, next) {
  if (req.session && req.session.user) {
    console.log("session is successfully being used");
  } else {
    console.log("session FAILED, please login");
    res.status(401).json({ message: "You are unauthorized, please login" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { userId: req.session.user.userId },
      {
        userId: req.session.user.userId,
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log("req.body.listOfArtists", req.body.listOfArtists);

    const artists = await addOrUpdateArtistsFromSpotify(
      req.body.listOfArtists,
      user
    );

    for (const artist of artists) {
      await User.updateOne(
        {
          userId: req.session.user.userId,
        },
        {
          $push: {
            selectedArtists: artist._id,
          },
        },
        {
          upsert: true,
        }
      );
    }

    const festivalResults = await getBandsInTownEvents(artists);

    const festivals = parseFestivalResults(festivalResults.eventsList);

    for (const festival of festivals) {
      await Festival.findOneAndUpdate(
        {
          name: festival.name,
          date: festival.date,
        },
        festival,
        {
          upsert: true,
        }
      );
    }
    console.log(
      `Successfully added ${req.body.listOfArtists.length} new artists and ${festivals.length} new festivals`
    );

    res
      .status(200)
      .json({
        message: `Successfully added ${req.body.listOfArtists.length} new artists and ${festivals.length} new festivals`,
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
});
