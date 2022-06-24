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

    try {

        let artistEventRequestArray = spotifyData.map((artist) => {

            let artistNameToQuery = artist.name

            // This is for edge cases where bandsintown results are weird...
            if (artist.name == "Justin Bieber") {
                artistNameToQuery = "JustinBieber"
            }

            return `https://rest.bandsintown.com/artists/${artistNameToQuery}/events?app_id=${process.env.BIT_API_KEY}&date=upcoming`
        })
        let listOfArtists = spotifyData.map(artist => ({
            "name": artist.name,
            "spotify_id": artist.id,
            "spotify_url": artist.external_urls.spotify,
            "image": artist.images[0].url
        }))



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
                    console.log(`Failed to find artist ${listOfArtists[index].name}`)
                    failedToFindArtistList.push(listOfArtists[index])
                } else if (promise.status == "fulfilled") {

                    promise.value.forEach(eventValue => {

                        const foundEvent = eventsList.find(event => event.title === eventValue.title);

                        // Event is already in event list
                        if (foundEvent) {
                            // Foundevent doesn't include the artist already
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
                            eventsList.push(eventValue)
                        }
                    })

                }


            })

            const finalObject = {
                "eventsList": eventsList,
                "failedToFindArtistList": failedToFindArtistList
            }
            res.send(finalObject)

        }
        start()

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
            "total": 132628
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
        "popularity": 55,
        "type": "artist",
        "uri": "spotify:artist:7lZauDnRoAC3kmaYae2opv"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/0Y0QSi6lz1bPik5Ffjr8sd"
        },
        "followers": {
            "href": null,
            "total": 137271
        },
        "genres": [
            "canadian electronic",
            "edm",
            "electro house",
            "electronic trap",
            "electropop",
            "future bass",
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
            "spotify": "https://open.spotify.com/artist/45eNHdiiabvmbp4erw26rg"
        },
        "followers": {
            "href": null,
            "total": 1259989
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
        "popularity": 72,
        "type": "artist",
        "uri": "spotify:artist:45eNHdiiabvmbp4erw26rg"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/2ZRQcIgzPCVaT9XKhXZIzh"
        },
        "followers": {
            "href": null,
            "total": 819705
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
        "popularity": 71,
        "type": "artist",
        "uri": "spotify:artist:2ZRQcIgzPCVaT9XKhXZIzh"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/0jNDKefhfSbLR9sFvcPLHo"
        },
        "followers": {
            "href": null,
            "total": 661924
        },
        "genres": [
            "edm",
            "electro house",
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
            "total": 5045564
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
            "total": 267359
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
            "spotify": "https://open.spotify.com/artist/4LZ4De2MoO3lP6QaNCfvcu"
        },
        "followers": {
            "href": null,
            "total": 242907
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
        "popularity": 59,
        "type": "artist",
        "uri": "spotify:artist:4LZ4De2MoO3lP6QaNCfvcu"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/69GGBxA162lTqCwzJG5jLp"
        },
        "followers": {
            "href": null,
            "total": 19149394
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
            "spotify": "https://open.spotify.com/artist/2bWTIIQP9zaVc55RaMGu7e"
        },
        "followers": {
            "href": null,
            "total": 191728
        },
        "genres": [
            "chill r&b",
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
            "spotify": "https://open.spotify.com/artist/3fjs4zbBFxEFFe8Wyojo0G"
        },
        "followers": {
            "href": null,
            "total": 93887
        },
        "genres": [
            "edm",
            "electropop",
            "future bass",
            "indie poptimism",
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
        "popularity": 50,
        "type": "artist",
        "uri": "spotify:artist:3fjs4zbBFxEFFe8Wyojo0G"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/21mKp7DqtSNHhCAU2ugvUw"
        },
        "followers": {
            "href": null,
            "total": 1393458
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
            "total": 1890
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
            "total": 6999043
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
        "popularity": 71,
        "type": "artist",
        "uri": "spotify:artist:3HqSLMAZ3g3d5poNaI7GOU"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/5w39eY1aNDybnDGTNgVt3r"
        },
        "followers": {
            "href": null,
            "total": 35183
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
            "spotify": "https://open.spotify.com/artist/6fcTRFpz0yH79qSKfof7lp"
        },
        "followers": {
            "href": null,
            "total": 425795
        },
        "genres": [
            "dubstep",
            "edm",
            "electro house",
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
            "total": 91262
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
            "spotify": "https://open.spotify.com/artist/7hOGhpa8RMSuDOWntGIAJt"
        },
        "followers": {
            "href": null,
            "total": 386845
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
            "spotify": "https://open.spotify.com/artist/0Ye4nfYAA91T1X56gnlXAA"
        },
        "followers": {
            "href": null,
            "total": 109425
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
        "popularity": 62,
        "type": "artist",
        "uri": "spotify:artist:0Ye4nfYAA91T1X56gnlXAA"
    },
    {
        "external_urls": {
            "spotify": "https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s"
        },
        "followers": {
            "href": null,
            "total": 61529310
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
        "popularity": 91,
        "type": "artist",
        "uri": "spotify:artist:1uNFoZAHBGtllmzznpCI3s"
    }
]