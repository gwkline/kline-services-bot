const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {

    if (req.cookies.id_token != null && req.cookies.id_token != "invalid") {
        console.log("Valid Cookie");
        res.status(200).sendFile(path.join(__dirname, 'index.html'));
    } else if (req.cookies.id_token == "invalid") {
        console.log("Not in server");
        res.status(200).sendFile(path.join(__dirname, 'index.html'));
        //non_member_index.html
    } else {
        console.log("Needs login token");
        res.status(200).sendFile(path.join(__dirname, 'index.html'));
        //loginindex.html
    }
});
// Routes
app.use('/api/discord', require('./api/discord.js'));

app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message,
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.message,
            });
    }
});

app.use(express.static('public'));