const Discord = require("discord.js");
const command = require("./stock_command.json")
const config = require("../config/config.json");
const utils = require("../utils");
const fetch = require('node-fetch');
const finished = require("stream");
require("dotenv").config();



const client = new Discord.Client({
    disableEveryone: true,
    partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
    intents: ['GUILD_MEMBERS', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES']
});

client.on("ready", async(e) => {
    console.log("Successfully logged in")
    client.user.setStatus('available')
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "Listening for &[command]",
            type: 'PLAYING'
        }
    })
});

client.on('messageCreate', async message => {
    if (!client.application.owner) await client.application.fetch();

    if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application.owner.id) {
        await client.application.commands.create(command);
    }

});

client.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) return;
    inStockEmbed(interaction.options._hoistedOptions[0].value, interaction)

});

client.on('message', async(msg) => {
    if (msg.author.bot) return;

    //SUCCESS TWEET
    if (msg.channelId == "844543753691463740" && msg.attachments.size > 0) {
        // send the message and wait for it to be sent
        const confirmation = await msg.reply(`Thanks for posting your success, ${msg.author}!`);
        return sendTweet(msg)
    }

    if (msg.content.startsWith("!stock")) {

        finished = await inStockEmbed()
        await msg.reply(finished)

    }
});

async function inStockEmbed(type, interaction) {

    let template = {
        "content": null,
        "embeds": [{
                "url": "https://discord.gg/ybFm6uMRvA",
                "color": 15868505,
                "image": {
                    "url": "https://i.imgur.com/7XQ0QeN.png"
                }
            },
            {
                "title": "__***Product Stock Checker:***__",
                "description": "One-Click Gmail Accounts: [stocknum]\nFarmed Gmail Accounts: [stocknum]\nAged Gmail Accounts: [stocknum]\nEDU Gmail Accounts: [stocknum]\nPrime EDU Gmail Accounts: [stocknum]\n\nForwarded Gmail Accounts (Pack of 21): [stocknum]\nForwarded Outlook/Microsoft Accounts: [stocknum]\n\nAged Amazon Account: [stocknum]\nFresh BestBuy Accounts: [stocknum]\nFresh Target Account: [stocknum]\nFresh SSense Accounts: [stocknum]\nFresh Walmart Accounts: [stocknum]\n\nWarmed FLX Accounts: [stocknum]\n\nFarmed Nike Account (Catchall): [stocknum]\nFarmed Nike Accounts (No Email Access): [stocknum]\nFarmed Nike Accounts (You Provide Emails): [stocknum]\n\nFresh Nike Accounts (Catchall): [stocknum]\nFresh Nike Accounts (No Email Access): [stocknum]\nFresh Nike Accounts (You Provide Emails): [stocknum]",
                "color": 15868505,
                "image": {
                    "url": "https://i.imgur.com/GCNBr54.png"
                },
                "thumbnail": {
                    "url": "https://i.imgur.com/M5w2jAS.png"
                }
            }
        ],
        "username": "Kline Accounts",
        "avatar_url": "https://i.imgur.com/unCJSO7.jpg"
    }

    switch (type) {
        case "view_all":
            break;
        case "nike":
            template.embeds[1].description = "Farmed Nike Account (Catchall): [stocknum]\nFarmed Nike Accounts (No Email Access): [stocknum]\nFarmed Nike Accounts (You Provide Emails): [stocknum]\n\nFresh Nike Accounts (Catchall): [stocknum]\nFresh Nike Accounts (No Email Access): [stocknum]\nFresh Nike Accounts (You Provide Emails): [stocknum]"
            break;
        case "gmail":
            template.embeds[1].description = "One-Click Gmail Accounts: [stocknum]\nFarmed Gmail Accounts: [stocknum]\nAged Gmail Accounts: [stocknum]\nEDU Gmail Accounts: [stocknum]\nPrime EDU Gmail Accounts: [stocknum]\n\nForwarded Gmail Accounts (Pack of 21): [stocknum]\nForwarded Outlook/Microsoft Accounts: [stocknum]"
            break;
        case "retail":
            template.embeds[1].description = "Aged Amazon Account: [stocknum]\nFresh BestBuy Accounts: [stocknum]\nFresh Target Account: [stocknum]\nFresh SSense Accounts: [stocknum]\nFresh Walmart Accounts: [stocknum]"
            break;

            //case "combos":
            //template.embeds[1].description = "One-Click Gmail Accounts: [stocknum]\nFarmed Gmail Accounts: [stocknum]\nAged Gmail Accounts: [stocknum]\nEDU Gmail Accounts: [stocknum]\nPrime EDU Gmail Accounts: [stocknum]\n\nForwarded Gmail Accounts (Pack of 21): [stocknum]\nForwarded Outlook/Microsoft Accounts: [stocknum]\n\nAged Amazon Account: [stocknum]\nFresh BestBuy Accounts: [stocknum]\nFresh Target Account: [stocknum]\nFresh SSense Accounts: [stocknum]\nFresh Walmart Accounts: [stocknum]\n\nWarmed FLX Accounts: [stocknum]\n\nFarmed Nike Account (Catchall): [stocknum]\nFarmed Nike Accounts (No Email Access): [stocknum]\nFarmed Nike Accounts (You Provide Emails): [stocknum]\n\nFresh Nike Accounts (Catchall): [stocknum]\nFresh Nike Accounts (No Email Access): [stocknum]\nFresh Nike Accounts (You Provide Emails): [stocknum]"
            //break;

        case "flx":
            template.embeds[1].description = "Warmed FLX Accounts: [stocknum]"
            break;

        default:
            break;
    }


    let options = {
        'method': 'GET',
        'json': true,
        'headers': {
            'User-Agent': "test",
            'Authorization': 'RQepAUVv32dl6HqfpsR2CmTpLXdDgk2Rl139wcJuXS5hnAwGKU',
        }
    };

    const inventoryJson = await fetch('https://shoppy.gg/api/v1/products', options);
    let inventory = await inventoryJson.json();

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
        template["embeds"][1]["description"] = template["embeds"][1]["description"].replace(prodString, newString)

    }

    interaction.reply(template)
    return template
}

async function alertSkill(order) {

    let template = {
        "content": null, //"<@743578165384839280>",
        "embeds": [{
            "title": "**New Order Recieved**",
            "description": "",
            "url": "https://docs.google.com/spreadsheets/d/1P-n9CSiuoyCx6BIc4SUAOnBaNCl8RIHUGvHOMuPMfyM/",
            "color": 16711767,
            "fields": [{
                    "name": "Timestamp:",
                    "value": "1"
                },
                {
                    "name": "Order ID:",
                    "value": "2"
                },
                {
                    "name": "Email:",
                    "value": "3"
                },
                {
                    "name": "Product:",
                    "value": "4"
                }
            ],
            "footer": {
                "text": "Kline Services",
                "icon_url": "https://i.imgur.com/unCJSO7.jpg"
            }
        }],
        "username": "Kline Services",
        "avatar_url": "https://i.imgur.com/unCJSO7.jpg"
    }
    template.embeds[0].fields[0].value = order.Timestamp
    template.embeds[0].fields[1].value = order.Order_ID
    template.embeds[0].fields[2].value = order.Email
    template.embeds[0].fields[3].value = order.Product

    client.channels.cache.get('945788250914713600').send(template).mention

}

async function createACOForm(type) {
    const auth = new google.auth.GoogleAuth({
        keyFile: "../config/credentials.json",
        scopes: "https://www.googleapis.com/auth/forms",
    });
    const client = await auth.getClient();
    const googleForms = google.forms({ version: "v4", auth: client });
    const formID = "HI";
    googleForms.forms.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:A",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [order.Timestamp, order.Order_ID, order.Email, order.Product, order.Custom_Field, order.Quantity, order.Price, payout, "Pending"] //, quantity, note, price
            ],
        },
    });
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

const login = () => {
    client.login('OTM4OTE1MDM3MDIyNjc1MDQ1.YfxOxQ.MauL-bwvGH2yz5iMkEIdae9WfIk')
        //client.login(config.tokenDiscord);
};


login();

module.exports = {
    alertSkill
}