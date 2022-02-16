const Discord = require("discord.js");
const config = require("../config/whop.json");
require("dotenv").config();
const utils = require("../utils");
var request = require('../node_modules/request');
const fs = require("fs");
const fetch = require('node-fetch');


const client = new Discord.Client({
    disableEveryone: true,
    partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
    intents: ['GUILD_MEMBERS', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES']
});
client.on("ready", async(e) => {
    console.log("Logged in to Kline bot 1")
    client.user.setStatus('available')
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "Listening for &[command]",
            type: 'PLAYING'
        }
    })
});
client.on("messageCreate", async(msg) => {
    // return res.send
    try {
        let message = msg["content"];
        let channel_id = msg["channel"].id;


        let command = process.env.WHOP_BOT_COMMAND
        if (message.substring(0, command.length).toLowerCase() == command) {
            var args = message.substring(command.length + 1).split(" ");
            var cmd = args[0];
            switch (cmd) {
                case "reset":
                    return resetKey(msg, args[1])
                case "push":
                    return sendPushNotification(msg, args)
            }
        }
    } catch {

    }
});
client.on('message', async(msg) => {
    if (msg.author.bot) return;

    //SUCCESS TWEET
    if ((msg.channelId == "844543753691463740") || (msg.channelID == "874118430595354704")) {
        // send the message and wait for it to be sent
        const confirmation = await msg.channel.send(`Thank you for posting your success, ${msg.author}!`);
        //return sendTweet(msg)
    }

    if (msg.content.startsWith("!stock")) {

        finished = await inStockEmbed()
        await msg.channel.send(finished)

    }
});

async function getEmbed() {
    try {
        fs.readFile('./js/inStock.txt', 'utf8', function(err, data) {
            if (err) {
                console.error(err)
                throw "unable to read .czrc file.";
            }
            return data
        });
    } catch (error) {
        console.log("Error: " + error);
    }
}

async function dataPull() {
    try {
        var options = {
            'method': 'GET',
            'url': 'https://shoppy.gg/api/v1/products',
            'json': true,
            'headers': {
                'User-Agent': "test",
                'Authorization': 'RQepAUVv32dl6HqfpsR2CmTpLXdDgk2Rl139wcJuXS5hnAwGKU',
            }
        };

        return await request.get(options)
    } catch (error) {
        console.log("Error: " + error);
    }
}

async function inStockEmbed() {

    let template = {
        "content": null,
        "embeds": [{
                "title": "__***Product Stock Checker:***__",
                "description": "One-Click Gmail Accounts: [stocknum]\nFarmed Gmail Accounts: [stocknum]\nAged Gmail Accounts: [stocknum]\nEDU Gmail Accounts: [stocknum]\nPrime EDU Gmail Accounts: [stocknum]\n\n\nForwarded Gmail Accounts (Pack of 21): [stocknum]\nForwarded Outlook/Microsoft Accounts: [stocknum]\n\nAged Amazon Account: [stocknum]\nFresh BestBuy Accounts: [stocknum]\nFresh Target Account: [stocknum]\nFresh SSense Accounts: [stocknum]\nFresh Walmart Accounts: [stocknum]\n\nWarmed FLX Accounts: [stocknum]\n\nFarmed Nike V2 Account (Catchall): [stocknum]\nFarmed Nike V2 Accounts (No Email Access): [stocknum]\nFarmed Nike V2 Accounts (You Provide Emails): [stocknum]\n\nFresh Nike V2 Accounts (Catchall): [stocknum]\nFresh Nike V2 Accounts (No Email Access): [stocknum]\nFresh Nike V2 Accounts (You Provide Emails): [stocknum]",
                "color": 15868505,
                "thumbnail": {
                    "url": "https://i.imgur.com/M5w2jAS.png"
                }
            },
            {
                "url": "https://discord.gg/ybFm6uMRvA",
                "color": 15868505,
                "image": {
                    "url": "https://i.imgur.com/7XQ0QeN.png"
                }
            }
        ],
        "username": "Kline Accounts",
        "avatar_url": "https://i.imgur.com/unCJSO7.jpg"
    }

    let options = {
        'method': 'GET',
        'json': true,
        'headers': {
            'User-Agent': "test",
            'Authorization': 'RQepAUVv32dl6HqfpsR2CmTpLXdDgk2Rl139wcJuXS5hnAwGKU',
        }
    };

    const getGuilds = await fetch('https://shoppy.gg/api/v1/products', options);
    let inventory = await getGuilds.json();

    //let inventory = await request.get(options)

    for (i = 0; i < Object.keys(inventory).length; i++) {
        if (parseInt(inventory[i]["stock"]) < 1) {
            stockLevel = ` ${inventory[i]["stock"]} :red_circle:`

        } else if ((parseInt(inventory[i]["stock"]) > 0) && (parseInt(inventory[i]["stock"]) < 20)) {
            stockLevel = ` ${inventory[i]["stock"]} :yellow_circle:`

        } else if ((parseInt(inventory[i]["stock"]) >= 20) && (parseInt(inventory[i]["stock"]) < 1000)) {
            stockLevel = ` ${inventory[i]["stock"]} :green_circle:`
        } else {
            stockLevel = ` ∞ :green_circle:`
        }


        prodString = `${inventory[i]["title"]}: [stocknum]`
        newString = `${inventory[i]["title"]}: ${stockLevel}`
        template["embeds"][0]["description"] = template["embeds"][0]["description"].replace(prodString, newString)

    }
    return template
}


const sendTweet = async(msg) => {
    let username = msg.author.username
    let image_link = msg.attachments.at(0).attachment
    let content = msg.content

    let auth = process.env["AIRDROP_PASSWORD"]

    utils.sendRequest(config.domain, `/discord/send_tweet`, { username, image_link, content, auth })
        .then(body => {
            return msg.reply(body["message"]);
        }).catch(err => {
            console.log(err)
            airbrake.notify(err)
        })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const login = () => {
    client.login(config.tokenDiscord);
};

login();