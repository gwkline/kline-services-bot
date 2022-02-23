const express = require('express');
const fetch = require('node-fetch');
const { catchAsync } = require('../utils');
const { URLSearchParams } = require('url');
const dayjs = require('dayjs');

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
var verified = false;
const redirect = encodeURIComponent('http://klineaccounts.com/api/discord/callback');


router.get('/login', (_, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds&response_type=code&redirect_uri=${redirect}`);
});


router.get('/callback', catchAsync(async(req, res) => {


    const accessCode = req.query.code;
    if (!accessCode) throw new Error('No access code returned from Discord');


    const scope = ['identify', 'email', 'guilds']
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code);
    params.append('redirect_uri', "http://klineaccounts.com/api/discord/callback");
    params.append('scope', scope.join());

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'post',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
    })

    token = await response.json()

    /*
    const fetchDiscordUserInfo = await fetch('http://discordapp.com/api/users/@me', {
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    const userInfo = await fetchDiscordUserInfo.json(); */


    const getGuilds = await fetch('https://discordapp.com/api/users/@me/guilds', {
        method: "GET",
        headers: {
            authorization: `Bearer ${token.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });

    verified = false;
    const guildObject = await getGuilds.json();
    for (guilds in guildObject) {
        if (guildObject[guilds]["name"] == "Kline Services") {
            verified = true;
        }
    }

    if (verified == true) {

        res.cookie('id_token', token.access_token, {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: false,
            expires: dayjs().add(5, "days").toDate(),
        });

        res.redirect(`/`);
    } else {
        res.cookie('id_token', "invalid", {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: false,
            expires: dayjs().add(5, "days").toDate(),
        });
        res.redirect(`/`);
    }



}));

module.exports = router;