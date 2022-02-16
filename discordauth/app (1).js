/*
var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
});
server.listen();
*/
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());


app.get('/', (req, res) => {
  
  if (req.cookies.id_token != null && req.cookies.id_token != "invalid") {
    console.log("Valid Cookie");
    res.status(200).sendFile(path.join(__dirname, 'index.html'));
  }
  else if (req.cookies.id_token == "invalid") {
    console.log("Not in server");
    res.status(200).sendFile(path.join(__dirname, 'non_member_index.html'));
  }
  else {
    console.log("Needs login token");
    res.status(200).sendFile(path.join(__dirname, 'loginindex.html'));
  }
});


app.listen(443, () => {
  console.info('Running on port 443');
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