var express = require("express");
var router = express.Router();
const https = require("https");
const axios = require("axios");

router.get("/artistevent", function (req, res, next) {
  try {
    axios
      .get(
        `https://rest.bandsintown.com/artists/illenium/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`
      )
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => res.send(err));
  } catch (err) {
    console.error("GG", err);
  }
});

router.get("/all-events", function (req, res, next) {
  let artistEventRequestArray = [];
  let listOfArtists = [];

  try {
    axios
      .get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: "Bearer " + req.session.user.access_token,
        },
      })
      .then((spotifyResponse) => {
        if (spotifyResponse.status == 200) {
          artistEventRequestArray = spotifyResponse.data.items.map((artist) => {
            let artistNameToQuery = artist.name;
            if (artist.name == "Justin Bieber") {
              artistNameToQuery = "JustinBieber";
            }

            return `https://rest.bandsintown.com/artists/${artistNameToQuery}/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`;
          });

          listOfArtists = spotifyResponse.data.items.map((artist) => ({
            name: artist.name,
            spotify_id: artist.id,
          }));

          start();
        } else throw spotifyResponse.statusCode;
      })
      .catch((err) => res.send(err));

    async function start() {
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
      res.send(finalObject);
    }
  } catch (err) {
    console.error("GG", err);
  }
});

module.exports = router;
