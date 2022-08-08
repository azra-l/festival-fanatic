var express = require("express");
var router = express.Router();
const https = require('https')
const axios = require("axios");

router.get('/search-artist', async function (req, res, next) {

    try {

        const queryInput = req.query.input

        const spotifyAccessToken = req.session.user.access_token;

        await axios.get(
            `https://api.spotify.com/v1/search?q=${queryInput}&type=artist`, {
            params: { limit: 50, offset: 0 },
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${spotifyAccessToken}`,
                'Content-Type': 'application/json',
            },
        }
        ).then(response => {
            res.send(response.data)
        }).catch(err => res.send(err));


    }
    catch (err) {
        console.error("Server search-artist endpoint error", err);
    }

});

module.exports = router;
