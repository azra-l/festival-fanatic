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

const spotifyData = [
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/7lZauDnRoAC3kmaYae2opv"
        },
        "followers": {
            "href": null,
            "total": 133291
        },
        "genres": [
            "canadian electronic",
            "edm",
            "electropop",
            "future bass",
            "melodic dubstep",
            "pop dance",
            "pop edm"
        ],
        "href": "https://api.spotify.com/v1/artists/7lZauDnRoAC3kmaYae2opv",
        "id": "7lZauDnRoAC3kmaYae2opv",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebdb691c4e0aff20504f6b6033",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174db691c4e0aff20504f6b6033",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178db691c4e0aff20504f6b6033",
                "width": 160
            }
        ],
        "name": "Dabin",
        "popularity": 54,
        "type": "artist",
        "uri": "spotify:artist:7lZauDnRoAC3kmaYae2opv"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/0Y0QSi6lz1bPik5Ffjr8sd"
        },
        "followers": {
            "href": null,
            "total": 137581
        },
        "genres": [
            "canadian electronic",
            "edm",
            "electro house",
            "electronic trap",
            "electropop",
            "future bass",
            "melodic dubstep",
            "pop dance",
            "pop edm",
            "vapor twitch"
        ],
        "href": "https://api.spotify.com/v1/artists/0Y0QSi6lz1bPik5Ffjr8sd",
        "id": "0Y0QSi6lz1bPik5Ffjr8sd",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb5944586f169166ac0a03735e",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051745944586f169166ac0a03735e",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1785944586f169166ac0a03735e",
                "width": 160
            }
        ],
        "name": "Ekali",
        "popularity": 48,
        "type": "artist",
        "uri": "spotify:artist:0Y0QSi6lz1bPik5Ffjr8sd"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/2ZRQcIgzPCVaT9XKhXZIzh"
        },
        "followers": {
            "href": null,
            "total": 823488
        },
        "genres": [
            "dance pop",
            "edm",
            "pop",
            "pop dance",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/2ZRQcIgzPCVaT9XKhXZIzh",
        "id": "2ZRQcIgzPCVaT9XKhXZIzh",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb3438d570442b657621abc703",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051743438d570442b657621abc703",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1783438d570442b657621abc703",
                "width": 160
            }
        ],
        "name": "Gryffin",
        "popularity": 70,
        "type": "artist",
        "uri": "spotify:artist:2ZRQcIgzPCVaT9XKhXZIzh"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/45eNHdiiabvmbp4erw26rg"
        },
        "followers": {
            "href": null,
            "total": 1264953
        },
        "genres": [
            "edm",
            "melodic dubstep",
            "pop",
            "pop dance",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/45eNHdiiabvmbp4erw26rg",
        "id": "45eNHdiiabvmbp4erw26rg",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb6b5fbf615ada187ce5e425c8",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051746b5fbf615ada187ce5e425c8",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1786b5fbf615ada187ce5e425c8",
                "width": 160
            }
        ],
        "name": "ILLENIUM",
        "popularity": 71,
        "type": "artist",
        "uri": "spotify:artist:45eNHdiiabvmbp4erw26rg"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/0jNDKefhfSbLR9sFvcPLHo"
        },
        "followers": {
            "href": null,
            "total": 663179
        },
        "genres": [
            "edm",
            "electronic trap",
            "electropop",
            "future bass",
            "pop dance",
            "pop edm",
            "vapor twitch"
        ],
        "href": "https://api.spotify.com/v1/artists/0jNDKefhfSbLR9sFvcPLHo",
        "id": "0jNDKefhfSbLR9sFvcPLHo",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebbea280428d4ffabf1d7b0095",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174bea280428d4ffabf1d7b0095",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178bea280428d4ffabf1d7b0095",
                "width": 160
            }
        ],
        "name": "San Holo",
        "popularity": 59,
        "type": "artist",
        "uri": "spotify:artist:0jNDKefhfSbLR9sFvcPLHo"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/5JZ7CnR6gTvEMKX4g70Amv"
        },
        "followers": {
            "href": null,
            "total": 5069647
        },
        "genres": [
            "dance pop",
            "electropop",
            "pop"
        ],
        "href": "https://api.spotify.com/v1/artists/5JZ7CnR6gTvEMKX4g70Amv",
        "id": "5JZ7CnR6gTvEMKX4g70Amv",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb5af53f295e6c42529fbd0873",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051745af53f295e6c42529fbd0873",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1785af53f295e6c42529fbd0873",
                "width": 160
            }
        ],
        "name": "Lauv",
        "popularity": 77,
        "type": "artist",
        "uri": "spotify:artist:5JZ7CnR6gTvEMKX4g70Amv"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/24V5UY0nChKpnb1TBPJhCw"
        },
        "followers": {
            "href": null,
            "total": 268235
        },
        "genres": [
            "edm",
            "electropop",
            "future bass",
            "indie poptimism",
            "pop dance",
            "pop edm",
            "tropical house",
            "vapor twitch"
        ],
        "href": "https://api.spotify.com/v1/artists/24V5UY0nChKpnb1TBPJhCw",
        "id": "24V5UY0nChKpnb1TBPJhCw",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebe8e5902d8c4aacb792109f67",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174e8e5902d8c4aacb792109f67",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178e8e5902d8c4aacb792109f67",
                "width": 160
            }
        ],
        "name": "Jai Wolf",
        "popularity": 55,
        "type": "artist",
        "uri": "spotify:artist:24V5UY0nChKpnb1TBPJhCw"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/60d24wfXkVzDSfLS6hyCjZ"
        },
        "followers": {
            "href": null,
            "total": 15571084
        },
        "genres": [
            "dance pop",
            "dutch edm",
            "edm",
            "electro house",
            "pop",
            "pop dance",
            "progressive house",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/60d24wfXkVzDSfLS6hyCjZ",
        "id": "60d24wfXkVzDSfLS6hyCjZ",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb66d17ee8690d2e8d94ee7387",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517466d17ee8690d2e8d94ee7387",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17866d17ee8690d2e8d94ee7387",
                "width": 160
            }
        ],
        "name": "Martin Garrix",
        "popularity": 76,
        "type": "artist",
        "uri": "spotify:artist:60d24wfXkVzDSfLS6hyCjZ"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/2bWTIIQP9zaVc55RaMGu7e"
        },
        "followers": {
            "href": null,
            "total": 195442
        },
        "genres": [
            "k-pop",
            "korean r&b"
        ],
        "href": "https://api.spotify.com/v1/artists/2bWTIIQP9zaVc55RaMGu7e",
        "id": "2bWTIIQP9zaVc55RaMGu7e",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebbbca2e91d07d2c53e6610570",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174bbca2e91d07d2c53e6610570",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178bbca2e91d07d2c53e6610570",
                "width": 160
            }
        ],
        "name": "Seori",
        "popularity": 56,
        "type": "artist",
        "uri": "spotify:artist:2bWTIIQP9zaVc55RaMGu7e"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/4LZ4De2MoO3lP6QaNCfvcu"
        },
        "followers": {
            "href": null,
            "total": 244168
        },
        "genres": [
            "edm",
            "electropop",
            "future bass",
            "melodic dubstep",
            "pop dance",
            "pop edm",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/4LZ4De2MoO3lP6QaNCfvcu",
        "id": "4LZ4De2MoO3lP6QaNCfvcu",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebcd9e2b8f901285164a7fde6c",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174cd9e2b8f901285164a7fde6c",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178cd9e2b8f901285164a7fde6c",
                "width": 160
            }
        ],
        "name": "Said The Sky",
        "popularity": 58,
        "type": "artist",
        "uri": "spotify:artist:4LZ4De2MoO3lP6QaNCfvcu"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/69GGBxA162lTqCwzJG5jLp"
        },
        "followers": {
            "href": null,
            "total": 19191758
        },
        "genres": [
            "dance pop",
            "edm",
            "electropop",
            "pop",
            "pop dance",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/69GGBxA162lTqCwzJG5jLp",
        "id": "69GGBxA162lTqCwzJG5jLp",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb3c02f4fb4cc9187c488afd50",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051743c02f4fb4cc9187c488afd50",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1783c02f4fb4cc9187c488afd50",
                "width": 160
            }
        ],
        "name": "The Chainsmokers",
        "popularity": 80,
        "type": "artist",
        "uri": "spotify:artist:69GGBxA162lTqCwzJG5jLp"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/3fjs4zbBFxEFFe8Wyojo0G"
        },
        "followers": {
            "href": null,
            "total": 94389
        },
        "genres": [
            "edm",
            "electropop",
            "future bass",
            "pop dance",
            "pop edm",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/3fjs4zbBFxEFFe8Wyojo0G",
        "id": "3fjs4zbBFxEFFe8Wyojo0G",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb8e5e193ad94cafbd69cb12e4",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051748e5e193ad94cafbd69cb12e4",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1788e5e193ad94cafbd69cb12e4",
                "width": 160
            }
        ],
        "name": "Elephante",
        "popularity": 49,
        "type": "artist",
        "uri": "spotify:artist:3fjs4zbBFxEFFe8Wyojo0G"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/5w39eY1aNDybnDGTNgVt3r"
        },
        "followers": {
            "href": null,
            "total": 35334
        },
        "genres": [
            "edm",
            "electropop",
            "pop dance",
            "pop edm"
        ],
        "href": "https://api.spotify.com/v1/artists/5w39eY1aNDybnDGTNgVt3r",
        "id": "5w39eY1aNDybnDGTNgVt3r",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb907bcb4ae15d53b6b218d582",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174907bcb4ae15d53b6b218d582",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178907bcb4ae15d53b6b218d582",
                "width": 160
            }
        ],
        "name": "Midnight Kids",
        "popularity": 48,
        "type": "artist",
        "uri": "spotify:artist:5w39eY1aNDybnDGTNgVt3r"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/21mKp7DqtSNHhCAU2ugvUw"
        },
        "followers": {
            "href": null,
            "total": 1399914
        },
        "genres": [
            "chillwave",
            "ninja"
        ],
        "href": "https://api.spotify.com/v1/artists/21mKp7DqtSNHhCAU2ugvUw",
        "id": "21mKp7DqtSNHhCAU2ugvUw",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb1b00f0413d659ee91b505f70",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051741b00f0413d659ee91b505f70",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1781b00f0413d659ee91b505f70",
                "width": 160
            }
        ],
        "name": "ODESZA",
        "popularity": 68,
        "type": "artist",
        "uri": "spotify:artist:21mKp7DqtSNHhCAU2ugvUw"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/6KBy5qqU4Vvs8HkN1Ll2v4"
        },
        "followers": {
            "href": null,
            "total": 1916
        },
        "genres": [],
        "href": "https://api.spotify.com/v1/artists/6KBy5qqU4Vvs8HkN1Ll2v4",
        "id": "6KBy5qqU4Vvs8HkN1Ll2v4",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebc08ef9423f3c5c05a8f7e8d6",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174c08ef9423f3c5c05a8f7e8d6",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178c08ef9423f3c5c05a8f7e8d6",
                "width": 160
            }
        ],
        "name": "Stanford Lin",
        "popularity": 25,
        "type": "artist",
        "uri": "spotify:artist:6KBy5qqU4Vvs8HkN1Ll2v4"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/3HqSLMAZ3g3d5poNaI7GOU"
        },
        "followers": {
            "href": null,
            "total": 7064672
        },
        "genres": [
            "k-pop"
        ],
        "href": "https://api.spotify.com/v1/artists/3HqSLMAZ3g3d5poNaI7GOU",
        "id": "3HqSLMAZ3g3d5poNaI7GOU",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb006ff3c0136a71bfb9928d34",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174006ff3c0136a71bfb9928d34",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178006ff3c0136a71bfb9928d34",
                "width": 160
            }
        ],
        "name": "IU",
        "popularity": 70,
        "type": "artist",
        "uri": "spotify:artist:3HqSLMAZ3g3d5poNaI7GOU"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1LOB7jTeEV14pHai6EXSzF"
        },
        "followers": {
            "href": null,
            "total": 655344
        },
        "genres": [
            "dance pop",
            "edm",
            "electro house",
            "electropop",
            "electropowerpop",
            "pop",
            "pop dance",
            "pop edm",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/1LOB7jTeEV14pHai6EXSzF",
        "id": "1LOB7jTeEV14pHai6EXSzF",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb580d49bdcc121033528ffaaf",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174580d49bdcc121033528ffaaf",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178580d49bdcc121033528ffaaf",
                "width": 160
            }
        ],
        "name": "Cash Cash",
        "popularity": 63,
        "type": "artist",
        "uri": "spotify:artist:1LOB7jTeEV14pHai6EXSzF"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/0Ye4nfYAA91T1X56gnlXAA"
        },
        "followers": {
            "href": null,
            "total": 109613
        },
        "genres": [
            "edm",
            "electropop",
            "indie poptimism",
            "pop dance",
            "pop edm",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/0Ye4nfYAA91T1X56gnlXAA",
        "id": "0Ye4nfYAA91T1X56gnlXAA",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb504b0fca5641238b704b87f8",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174504b0fca5641238b704b87f8",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178504b0fca5641238b704b87f8",
                "width": 160
            }
        ],
        "name": "Mako",
        "popularity": 61,
        "type": "artist",
        "uri": "spotify:artist:0Ye4nfYAA91T1X56gnlXAA"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/6fcTRFpz0yH79qSKfof7lp"
        },
        "followers": {
            "href": null,
            "total": 427111
        },
        "genres": [
            "dubstep",
            "edm",
            "electro house",
            "future bass",
            "melodic dubstep",
            "pop dance",
            "pop edm",
            "progressive trance"
        ],
        "href": "https://api.spotify.com/v1/artists/6fcTRFpz0yH79qSKfof7lp",
        "id": "6fcTRFpz0yH79qSKfof7lp",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb3a120b5c7fefeed869234a71",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051743a120b5c7fefeed869234a71",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1783a120b5c7fefeed869234a71",
                "width": 160
            }
        ],
        "name": "Seven Lions",
        "popularity": 59,
        "type": "artist",
        "uri": "spotify:artist:6fcTRFpz0yH79qSKfof7lp"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/7KC9q5wx0bxMD5ABgLCoEd"
        },
        "followers": {
            "href": null,
            "total": 91734
        },
        "genres": [
            "bc underground hip hop",
            "canadian contemporary r&b",
            "trap soul"
        ],
        "href": "https://api.spotify.com/v1/artists/7KC9q5wx0bxMD5ABgLCoEd",
        "id": "7KC9q5wx0bxMD5ABgLCoEd",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb3d78a9352ce74707da54a1ec",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051743d78a9352ce74707da54a1ec",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1783d78a9352ce74707da54a1ec",
                "width": 160
            }
        ],
        "name": "MANILA GREY",
        "popularity": 48,
        "type": "artist",
        "uri": "spotify:artist:7KC9q5wx0bxMD5ABgLCoEd"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1IueXOQyABrMOprrzwQJWN"
        },
        "followers": {
            "href": null,
            "total": 1432035
        },
        "genres": [
            "dance pop",
            "edm",
            "house",
            "pop",
            "pop dance",
            "tropical house",
            "uk pop"
        ],
        "href": "https://api.spotify.com/v1/artists/1IueXOQyABrMOprrzwQJWN",
        "id": "1IueXOQyABrMOprrzwQJWN",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb8422afa6e7b0c977636bfebd",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051748422afa6e7b0c977636bfebd",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1788422afa6e7b0c977636bfebd",
                "width": 160
            }
        ],
        "name": "Sigala",
        "popularity": 73,
        "type": "artist",
        "uri": "spotify:artist:1IueXOQyABrMOprrzwQJWN"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s"
        },
        "followers": {
            "href": null,
            "total": 62209532
        },
        "genres": [
            "canadian pop",
            "pop"
        ],
        "href": "https://api.spotify.com/v1/artists/1uNFoZAHBGtllmzznpCI3s",
        "id": "1uNFoZAHBGtllmzznpCI3s",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051748ae7f2aaa9817a704a87ea36",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1788ae7f2aaa9817a704a87ea36",
                "width": 160
            }
        ],
        "name": "Justin Bieber",
        "popularity": 90,
        "type": "artist",
        "uri": "spotify:artist:1uNFoZAHBGtllmzznpCI3s"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/7hOGhpa8RMSuDOWntGIAJt"
        },
        "followers": {
            "href": null,
            "total": 387677
        },
        "genres": [
            "electropop",
            "indie poptimism",
            "pop",
            "pop dance",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/7hOGhpa8RMSuDOWntGIAJt",
        "id": "7hOGhpa8RMSuDOWntGIAJt",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb8ec2cd2c426ae40191391487",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051748ec2cd2c426ae40191391487",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1788ec2cd2c426ae40191391487",
                "width": 160
            }
        ],
        "name": "A R I Z O N A",
        "popularity": 60,
        "type": "artist",
        "uri": "spotify:artist:7hOGhpa8RMSuDOWntGIAJt"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/20lmiQy576CSBPz0VJHmnC"
        },
        "followers": {
            "href": null,
            "total": 17437
        },
        "genres": [
            "future bass",
            "melodic dubstep",
            "pop dance",
            "pop edm"
        ],
        "href": "https://api.spotify.com/v1/artists/20lmiQy576CSBPz0VJHmnC",
        "id": "20lmiQy576CSBPz0VJHmnC",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebfc7e3afd7df90aed91c4de38",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174fc7e3afd7df90aed91c4de38",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178fc7e3afd7df90aed91c4de38",
                "width": 160
            }
        ],
        "name": "yetep",
        "popularity": 42,
        "type": "artist",
        "uri": "spotify:artist:20lmiQy576CSBPz0VJHmnC"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/20DZAfCuP1TKZl5KcY7z3Q"
        },
        "followers": {
            "href": null,
            "total": 359782
        },
        "genres": [
            "dubstep",
            "edm",
            "pop dance"
        ],
        "href": "https://api.spotify.com/v1/artists/20DZAfCuP1TKZl5KcY7z3Q",
        "id": "20DZAfCuP1TKZl5KcY7z3Q",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb8ea9bed64e98b8ad91b1f98d",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051748ea9bed64e98b8ad91b1f98d",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1788ea9bed64e98b8ad91b1f98d",
                "width": 160
            }
        ],
        "name": "SLANDER",
        "popularity": 67,
        "type": "artist",
        "uri": "spotify:artist:20DZAfCuP1TKZl5KcY7z3Q"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/64KEffDW9EtZ1y2vBYgq8T"
        },
        "followers": {
            "href": null,
            "total": 33801242
        },
        "genres": [
            "brostep",
            "dance pop",
            "edm",
            "pop",
            "pop dance",
            "progressive electro house"
        ],
        "href": "https://api.spotify.com/v1/artists/64KEffDW9EtZ1y2vBYgq8T",
        "id": "64KEffDW9EtZ1y2vBYgq8T",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eba91af711541f8807ed7f0676",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174a91af711541f8807ed7f0676",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178a91af711541f8807ed7f0676",
                "width": 160
            }
        ],
        "name": "Marshmello",
        "popularity": 81,
        "type": "artist",
        "uri": "spotify:artist:64KEffDW9EtZ1y2vBYgq8T"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/7CajNmpbOovFoOoasH2HaY"
        },
        "followers": {
            "href": null,
            "total": 22808522
        },
        "genres": [
            "dance pop",
            "edm",
            "electro house",
            "house",
            "pop",
            "pop rap",
            "progressive house",
            "uk dance"
        ],
        "href": "https://api.spotify.com/v1/artists/7CajNmpbOovFoOoasH2HaY",
        "id": "7CajNmpbOovFoOoasH2HaY",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb578905d5539cff25568dc097",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174578905d5539cff25568dc097",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178578905d5539cff25568dc097",
                "width": 160
            }
        ],
        "name": "Calvin Harris",
        "popularity": 84,
        "type": "artist",
        "uri": "spotify:artist:7CajNmpbOovFoOoasH2HaY"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/2p4FqHnazRucYQHyDCdBrJ"
        },
        "followers": {
            "href": null,
            "total": 3184744
        },
        "genres": [
            "canadian pop punk",
            "canadian punk",
            "canadian rock",
            "pop punk"
        ],
        "href": "https://api.spotify.com/v1/artists/2p4FqHnazRucYQHyDCdBrJ",
        "id": "2p4FqHnazRucYQHyDCdBrJ",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb14be52ba7ed12e0177ebe08b",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517414be52ba7ed12e0177ebe08b",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17814be52ba7ed12e0177ebe08b",
                "width": 160
            }
        ],
        "name": "Simple Plan",
        "popularity": 67,
        "type": "artist",
        "uri": "spotify:artist:2p4FqHnazRucYQHyDCdBrJ"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/3dz0NnIZhtKKeXZxLOxCam"
        },
        "followers": {
            "href": null,
            "total": 995439
        },
        "genres": [
            "complextro",
            "edm",
            "future bass",
            "melodic dubstep",
            "progressive electro house"
        ],
        "href": "https://api.spotify.com/v1/artists/3dz0NnIZhtKKeXZxLOxCam",
        "id": "3dz0NnIZhtKKeXZxLOxCam",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb1804f56bdcb9322c5f3f8f21",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051741804f56bdcb9322c5f3f8f21",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1781804f56bdcb9322c5f3f8f21",
                "width": 160
            }
        ],
        "name": "Porter Robinson",
        "popularity": 60,
        "type": "artist",
        "uri": "spotify:artist:3dz0NnIZhtKKeXZxLOxCam"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX"
        },
        "followers": {
            "href": null,
            "total": 51216191
        },
        "genres": [
            "k-pop",
            "k-pop boy group"
        ],
        "href": "https://api.spotify.com/v1/artists/3Nrfpe0tUJi4K4DXYWgMUX",
        "id": "3Nrfpe0tUJi4K4DXYWgMUX",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051745704a64f34fe29ff73ab56bb",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1785704a64f34fe29ff73ab56bb",
                "width": 160
            }
        ],
        "name": "BTS",
        "popularity": 92,
        "type": "artist",
        "uri": "spotify:artist:3Nrfpe0tUJi4K4DXYWgMUX"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/23fqKkggKUBHNkbKtXEls4"
        },
        "followers": {
            "href": null,
            "total": 8061591
        },
        "genres": [
            "edm",
            "pop",
            "pop dance",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/23fqKkggKUBHNkbKtXEls4",
        "id": "23fqKkggKUBHNkbKtXEls4",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb6567299e3c53cf2a250fbdce",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051746567299e3c53cf2a250fbdce",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1786567299e3c53cf2a250fbdce",
                "width": 160
            }
        ],
        "name": "Kygo",
        "popularity": 79,
        "type": "artist",
        "uri": "spotify:artist:23fqKkggKUBHNkbKtXEls4"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/3hyEbRtp617pNCuuQjyOmc"
        },
        "followers": {
            "href": null,
            "total": 360085
        },
        "genres": [
            "dance pop",
            "edm",
            "pop",
            "pop dance",
            "pop edm",
            "pop rap",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/3hyEbRtp617pNCuuQjyOmc",
        "id": "3hyEbRtp617pNCuuQjyOmc",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eba143e59c7af9f75f44ffd6b2",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174a143e59c7af9f75f44ffd6b2",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178a143e59c7af9f75f44ffd6b2",
                "width": 160
            }
        ],
        "name": "Lost Kings",
        "popularity": 59,
        "type": "artist",
        "uri": "spotify:artist:3hyEbRtp617pNCuuQjyOmc"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V"
        },
        "followers": {
            "href": null,
            "total": 98801295
        },
        "genres": [
            "pop",
            "uk pop"
        ],
        "href": "https://api.spotify.com/v1/artists/6eUKZXaKkcviH0Ku9w2n3V",
        "id": "6eUKZXaKkcviH0Ku9w2n3V",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517412a2ef08d00dd7451a6dbed6",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17812a2ef08d00dd7451a6dbed6",
                "width": 160
            }
        ],
        "name": "Ed Sheeran",
        "popularity": 90,
        "type": "artist",
        "uri": "spotify:artist:6eUKZXaKkcviH0Ku9w2n3V"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1bqxdqvUtPWZri43cKHac8"
        },
        "followers": {
            "href": null,
            "total": 748664
        },
        "genres": [
            "australian pop",
            "dance pop",
            "electropop",
            "pop",
            "post-teen pop",
            "viral pop"
        ],
        "href": "https://api.spotify.com/v1/artists/1bqxdqvUtPWZri43cKHac8",
        "id": "1bqxdqvUtPWZri43cKHac8",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb09ce0644c08fa03347ef8928",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517409ce0644c08fa03347ef8928",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17809ce0644c08fa03347ef8928",
                "width": 160
            }
        ],
        "name": "MAX",
        "popularity": 68,
        "type": "artist",
        "uri": "spotify:artist:1bqxdqvUtPWZri43cKHac8"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/04gDigrS5kc9YWfZHwBETP"
        },
        "followers": {
            "href": null,
            "total": 36797354
        },
        "genres": [
            "pop"
        ],
        "href": "https://api.spotify.com/v1/artists/04gDigrS5kc9YWfZHwBETP",
        "id": "04gDigrS5kc9YWfZHwBETP",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb288ac05481cedc5bddb5b11b",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174288ac05481cedc5bddb5b11b",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178288ac05481cedc5bddb5b11b",
                "width": 160
            }
        ],
        "name": "Maroon 5",
        "popularity": 84,
        "type": "artist",
        "uri": "spotify:artist:04gDigrS5kc9YWfZHwBETP"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/053q0ukIDRgzwTr4vNSwab"
        },
        "followers": {
            "href": null,
            "total": 1700133
        },
        "genres": [
            "art pop",
            "canadian electropop",
            "chillwave",
            "dance pop",
            "grave wave",
            "indietronica",
            "metropopolis",
            "pop"
        ],
        "href": "https://api.spotify.com/v1/artists/053q0ukIDRgzwTr4vNSwab",
        "id": "053q0ukIDRgzwTr4vNSwab",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb34771f759ca81a422f5f2b57",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517434771f759ca81a422f5f2b57",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17834771f759ca81a422f5f2b57",
                "width": 160
            }
        ],
        "name": "Grimes",
        "popularity": 66,
        "type": "artist",
        "uri": "spotify:artist:053q0ukIDRgzwTr4vNSwab"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/4F5TrtYYxsVM1PhbtISE5m"
        },
        "followers": {
            "href": null,
            "total": 340125
        },
        "genres": [
            "c-pop",
            "cantopop",
            "classic cantopop",
            "hong kong rock"
        ],
        "href": "https://api.spotify.com/v1/artists/4F5TrtYYxsVM1PhbtISE5m",
        "id": "4F5TrtYYxsVM1PhbtISE5m",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab67616d0000b27371befcc92c268193bdda52db",
                "width": 640
            },
            {
                "height": 300,
                "url": "https://i.scdn.co/image/ab67616d00001e0271befcc92c268193bdda52db",
                "width": 300
            },
            {
                "height": 64,
                "url": "https://i.scdn.co/image/ab67616d0000485171befcc92c268193bdda52db",
                "width": 64
            }
        ],
        "name": "Beyond",
        "popularity": 52,
        "type": "artist",
        "uri": "spotify:artist:4F5TrtYYxsVM1PhbtISE5m"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1GxkXlMwML1oSg5eLPiAz3"
        },
        "followers": {
            "href": null,
            "total": 5316888
        },
        "genres": [
            "adult standards",
            "canadian pop",
            "jazz pop",
            "lounge"
        ],
        "href": "https://api.spotify.com/v1/artists/1GxkXlMwML1oSg5eLPiAz3",
        "id": "1GxkXlMwML1oSg5eLPiAz3",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebef8cf61fea4923d2bde68200",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174ef8cf61fea4923d2bde68200",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178ef8cf61fea4923d2bde68200",
                "width": 160
            }
        ],
        "name": "Michael Bublé",
        "popularity": 72,
        "type": "artist",
        "uri": "spotify:artist:1GxkXlMwML1oSg5eLPiAz3"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/41MozSoPIsD1dJM0CLPjZF"
        },
        "followers": {
            "href": null,
            "total": 30506583
        },
        "genres": [
            "k-pop",
            "k-pop girl group"
        ],
        "href": "https://api.spotify.com/v1/artists/41MozSoPIsD1dJM0CLPjZF",
        "id": "41MozSoPIsD1dJM0CLPjZF",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb9f73197444a8a6b016f4a546",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051749f73197444a8a6b016f4a546",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1789f73197444a8a6b016f4a546",
                "width": 160
            }
        ],
        "name": "BLACKPINK",
        "popularity": 78,
        "type": "artist",
        "uri": "spotify:artist:41MozSoPIsD1dJM0CLPjZF"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/7n2wHs1TKAczGzO7Dd2rGr"
        },
        "followers": {
            "href": null,
            "total": 38214029
        },
        "genres": [
            "canadian pop",
            "pop",
            "viral pop"
        ],
        "href": "https://api.spotify.com/v1/artists/7n2wHs1TKAczGzO7Dd2rGr",
        "id": "7n2wHs1TKAczGzO7Dd2rGr",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb46e7a06fa6dfefaed6a3f0db",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517446e7a06fa6dfefaed6a3f0db",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17846e7a06fa6dfefaed6a3f0db",
                "width": 160
            }
        ],
        "name": "Shawn Mendes",
        "popularity": 83,
        "type": "artist",
        "uri": "spotify:artist:7n2wHs1TKAczGzO7Dd2rGr"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/5CiGnKThu5ctn9pBxv7DGa"
        },
        "followers": {
            "href": null,
            "total": 909502
        },
        "genres": [
            "electropop",
            "pop",
            "pop rap"
        ],
        "href": "https://api.spotify.com/v1/artists/5CiGnKThu5ctn9pBxv7DGa",
        "id": "5CiGnKThu5ctn9pBxv7DGa",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb766d2fb038033d3fbde69f89",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174766d2fb038033d3fbde69f89",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178766d2fb038033d3fbde69f89",
                "width": 160
            }
        ],
        "name": "benny blanco",
        "popularity": 71,
        "type": "artist",
        "uri": "spotify:artist:5CiGnKThu5ctn9pBxv7DGa"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/5Rl15oVamLq7FbSb0NNBNy"
        },
        "followers": {
            "href": null,
            "total": 8617011
        },
        "genres": [
            "boy band",
            "dance pop",
            "pop",
            "post-teen pop"
        ],
        "href": "https://api.spotify.com/v1/artists/5Rl15oVamLq7FbSb0NNBNy",
        "id": "5Rl15oVamLq7FbSb0NNBNy",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb5a3e65b6541c0ee57a5273c8",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051745a3e65b6541c0ee57a5273c8",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1785a3e65b6541c0ee57a5273c8",
                "width": 160
            }
        ],
        "name": "5 Seconds of Summer",
        "popularity": 78,
        "type": "artist",
        "uri": "spotify:artist:5Rl15oVamLq7FbSb0NNBNy"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1Cs0zKBU1kc0i8ypK3B9ai"
        },
        "followers": {
            "href": null,
            "total": 24399924
        },
        "genres": [
            "big room",
            "dance pop",
            "edm",
            "pop",
            "pop dance",
            "pop rap"
        ],
        "href": "https://api.spotify.com/v1/artists/1Cs0zKBU1kc0i8ypK3B9ai",
        "id": "1Cs0zKBU1kc0i8ypK3B9ai",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb75348e1aade2645ad9c58829",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517475348e1aade2645ad9c58829",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17875348e1aade2645ad9c58829",
                "width": 160
            }
        ],
        "name": "David Guetta",
        "popularity": 85,
        "type": "artist",
        "uri": "spotify:artist:1Cs0zKBU1kc0i8ypK3B9ai"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/7d5SfGXKpgS3JK8BFIq59h"
        },
        "followers": {
            "href": null,
            "total": 76262
        },
        "genres": [
            "edm",
            "melodic dubstep",
            "pop dance",
            "pop edm"
        ],
        "href": "https://api.spotify.com/v1/artists/7d5SfGXKpgS3JK8BFIq59h",
        "id": "7d5SfGXKpgS3JK8BFIq59h",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebb3b49b8fbf5fb73a02bb7565",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174b3b49b8fbf5fb73a02bb7565",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178b3b49b8fbf5fb73a02bb7565",
                "width": 160
            }
        ],
        "name": "William Black",
        "popularity": 53,
        "type": "artist",
        "uri": "spotify:artist:7d5SfGXKpgS3JK8BFIq59h"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/3WGpXCj9YhhfX11TToZcXP"
        },
        "followers": {
            "href": null,
            "total": 6876902
        },
        "genres": [
            "australian pop",
            "dance pop",
            "pop",
            "viral pop"
        ],
        "href": "https://api.spotify.com/v1/artists/3WGpXCj9YhhfX11TToZcXP",
        "id": "3WGpXCj9YhhfX11TToZcXP",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb002eedc44fefe085daae10e4",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174002eedc44fefe085daae10e4",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178002eedc44fefe085daae10e4",
                "width": 160
            }
        ],
        "name": "Troye Sivan",
        "popularity": 77,
        "type": "artist",
        "uri": "spotify:artist:3WGpXCj9YhhfX11TToZcXP"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/0daugAjUgbJSqdlyYNwIbT"
        },
        "followers": {
            "href": null,
            "total": 403980
        },
        "genres": [
            "edm",
            "electro house",
            "pop dance",
            "pop edm",
            "progressive electro house",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/0daugAjUgbJSqdlyYNwIbT",
        "id": "0daugAjUgbJSqdlyYNwIbT",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb7478c400ce7d90d90b71e70b",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab676161000051747478c400ce7d90d90b71e70b",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f1787478c400ce7d90d90b71e70b",
                "width": 160
            }
        ],
        "name": "Vicetone",
        "popularity": 63,
        "type": "artist",
        "uri": "spotify:artist:0daugAjUgbJSqdlyYNwIbT"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1vCWHaC5f2uS3yhpwWbIA6"
        },
        "followers": {
            "href": null,
            "total": 21834238
        },
        "genres": [
            "dance pop",
            "edm",
            "pop",
            "pop dance",
            "pop rap"
        ],
        "href": "https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6",
        "id": "1vCWHaC5f2uS3yhpwWbIA6",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb09bf4814c6585e1f69dfeef7",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517409bf4814c6585e1f69dfeef7",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17809bf4814c6585e1f69dfeef7",
                "width": 160
            }
        ],
        "name": "Avicii",
        "popularity": 79,
        "type": "artist",
        "uri": "spotify:artist:1vCWHaC5f2uS3yhpwWbIA6"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/2qxJFvFYMEDqd7ui6kSAcq"
        },
        "followers": {
            "href": null,
            "total": 5767126
        },
        "genres": [
            "complextro",
            "dance pop",
            "edm",
            "electro house",
            "electropop",
            "german techno",
            "pop",
            "pop dance",
            "pop rap",
            "tropical house"
        ],
        "href": "https://api.spotify.com/v1/artists/2qxJFvFYMEDqd7ui6kSAcq",
        "id": "2qxJFvFYMEDqd7ui6kSAcq",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5eb88d30a4c3e7d79a0cdfe96b3",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab6761610000517488d30a4c3e7d79a0cdfe96b3",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f17888d30a4c3e7d79a0cdfe96b3",
                "width": 160
            }
        ],
        "name": "Zedd",
        "popularity": 74,
        "type": "artist",
        "uri": "spotify:artist:2qxJFvFYMEDqd7ui6kSAcq"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/3ApUX1o6oSz321MMECyIYd"
        },
        "followers": {
            "href": null,
            "total": 703133
        },
        "genres": [
            "electropop",
            "indie pop rap",
            "pop",
            "pop rap"
        ],
        "href": "https://api.spotify.com/v1/artists/3ApUX1o6oSz321MMECyIYd",
        "id": "3ApUX1o6oSz321MMECyIYd",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebc5bf602162d30b7133cfe96a",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174c5bf602162d30b7133cfe96a",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178c5bf602162d30b7133cfe96a",
                "width": 160
            }
        ],
        "name": "Quinn XCII",
        "popularity": 67,
        "type": "artist",
        "uri": "spotify:artist:3ApUX1o6oSz321MMECyIYd"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m"
        },
        "followers": {
            "href": null,
            "total": 31552249
        },
        "genres": [
            "dance pop",
            "pop",
            "r&b"
        ],
        "href": "https://api.spotify.com/v1/artists/6vWDO969PvNqNYHIOW5v0m",
        "id": "6vWDO969PvNqNYHIOW5v0m",
        "images": [
            {
                "height": 640,
                "url": "https://i.scdn.co/image/ab6761610000e5ebd3d058be8485c8583703b6d2",
                "width": 640
            },
            {
                "height": 320,
                "url": "https://i.scdn.co/image/ab67616100005174d3d058be8485c8583703b6d2",
                "width": 320
            },
            {
                "height": 160,
                "url": "https://i.scdn.co/image/ab6761610000f178d3d058be8485c8583703b6d2",
                "width": 160
            }
        ],
        "name": "Beyoncé",
        "popularity": 82,
        "type": "artist",
        "uri": "spotify:artist:6vWDO969PvNqNYHIOW5v0m"
    }
]

