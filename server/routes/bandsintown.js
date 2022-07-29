// TODO: Is this even being used anymore?

var express = require('express');
var router = express.Router();
const https = require('https')
const axios = require("axios");

router.get('/artistevent', function (req, res, next) {

    try {
        axios.get(`https://rest.bandsintown.com/artists/illenium/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`)
            .then(response => {
                res.send(response.data)
            })
            .catch(err => res.send(err));
    }
    catch (err) {
        console.error("GG", err);
    }

});


router.get('/all-events', function (req, res, next) {

    let artistEventRequestArray = []
    let listOfArtists = []

    try {

        axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                Authorization: 'Bearer ' + req.session.user.access_token //the token is a variable which holds the token
            }
        }).then(spotifyResponse => {
            // console.log("spotifyResponse.statusCode", spotifyResponse)

            if (spotifyResponse.status == 200) {

                // console.log(spotifyResponse.data.items)

                artistEventRequestArray = spotifyResponse.data.items.map((artist) => {

                    let artistNameToQuery = artist.name

                    // This is for edge cases where bandsintown results are weird...
                    if (artist.name == "Justin Bieber") {
                        artistNameToQuery = "JustinBieber"
                    }

                    return `https://rest.bandsintown.com/artists/${artistNameToQuery}/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`
                })

                listOfArtists = spotifyResponse.data.items.map(artist => ({
                    "name": artist.name,
                    "spotify_id": artist.id,
                    // TODO: Temproairly taking this off cuz some artists don't have it, need to have a check
                    // "spotify_url": artist.external_urls.spotify,
                    // "image": artist.images[0].url
                }))

                start()


            } else throw spotifyResponse.statusCode


        }).catch(err => res.send(err));


        async function start() {


            const result = await Promise.allSettled(artistEventRequestArray.map((request) => {
                return axios.get(request).then((response) => {
                    return response.data;
                }).then((data) => {
                    return data;
                });
            }));

            let failedToFindArtistList = []
            let eventsList = []

            result.forEach((promise, index) => {

                if (promise.status == "rejected") {
                    // have a list of failed to find artist b/c bandsintown doesn't have all artists
                    failedToFindArtistList.push(listOfArtists[index])
                } else if (promise.status == "fulfilled") {

                    promise.value.forEach(eventValue => {

                        const foundEvent = eventsList.find(eventInCurrentList => eventInCurrentList.title === eventValue.title);

                        // Event is already in event list
                        if (foundEvent) {
                            // Existing event found in current event list, just include it in the lineup
                            if (!foundEvent.lineup.find(element => { return element.name.toLowerCase() === listOfArtists[index].name.toLowerCase() }))
                                foundEvent.lineup.push(listOfArtists[index])
                        } else {
                            // Overwite the lineup:["Dabin"] to lineup:[
                            //     {
                            //         "spotify_url": "https://open.spotify.com/artist/7lZauDnRoAC3kmaYae2opv",
                            //         "id": "7lZauDnRoAC3kmaYae2opv",
                            //         "image" : "https://i.scdn.co/image/ab6761610000e5ebdb691c4e0aff20504f6b6033",
                            //         "name": "Dabin",
                            //     }
                            // ]
                            eventValue.lineup = [listOfArtists[index]]


                            // Remove weird artist object from bandsintown API where it is always shown on first event found
                            delete eventValue.artist

                            eventsList.push(eventValue)
                        }
                    })

                }


            })

            console.log(`Failed to find artists ${JSON.stringify(failedToFindArtistList.map(artist => artist.name))}`)


            const finalObject = {
                "eventsList": eventsList,
                "failedToFindArtistList": failedToFindArtistList
            }
            res.send(finalObject)

        }


    }
    catch (err) {
        console.error("GG", err);
    }

});


module.exports = router;
