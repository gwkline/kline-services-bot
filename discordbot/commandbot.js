const Discord = require("discord.js");
const command = require("./stock_command.json")
const config = require("../config/config.json");
const utils = require("../utils");
const fetch = require('node-fetch');
require("dotenv").config();
const ticket = require("./ticket");
const { parse } = require("dotenv");


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

    setInterval(updateStock, 1000 * 10)
});

client.on('messageCreate', async message => {
    if (!client.application.owner) await client.application.fetch();

    if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application.owner.id) {
        message.reply('Deploying...')
        let support_role = await message.guild.roles.cache.get('959628440875712512')
        let support = {
            "name": "support",
            "description": "Respond to customer issues",
            "role": support_role.id,
            "options": [{
                "name": "selection",
                "type": "STRING",
                "description": "Which issue to address",
                "required": true,
                "choices": [{
                        "name": "Check Order Date",
                        "value": "date-check",
                        "type": "1",
                        "options": [{
                            "name": "Order ID",
                            "type": "STRING",
                            "description": "The customer's order ID",
                            "required": true
                        }]
                    },
                    {
                        "name": "Replace Gmail",
                        "value": "replace-gmail"
                    },
                    {
                        "name": "Re-verify Gmail",
                        "value": "reverify-gmail"
                    },
                    {
                        "name": "Replace Amazon",
                        "value": "replace-amazon"
                    },
                    {
                        "name": "Replace FLX",
                        "value": "replace-flx"
                    },
                    {
                        "name": "Too Long",
                        "value": "too-long"
                    }
                ]
            }]
        }
        await client.application.commands.create(command);
        await client.application.commands.create(support);
    }

    if (message.content.toLowerCase().includes('!check') && message.channel.id === "785355394444296196") {
        await dateCheck(message)
    }

});

client.on('interactionCreate', async interaction => {
    // switch (interaction.customID) {
    //     //When user selects the "Open Ticket" button
    //     case "openTicket-kline":
    //         await ticket.makeTicket(interaction)
    //         break;

    //     //When user selects the "Close Ticket" button
    //     case "closeTicket-kline":
    //         await ticket.closeTicket(interaction)
    //         break;

    //     case "accountIssue-kline":
    //         await ticket.accountIssue(interaction)
    //         break;

    //     case "q1no-kline":
    //         await ticket.q2(interaction)
    //         break;

    //     case "accountDelivery-kline":
    //         await ticket.accountDelivery(interaction)
    //         break;

    //     case "generalQuestion-kline":
    //         await ticket.generalQuestion(interaction)
    //         break;

    //     //When user selects the "Close" button to confirm they want to close their ticket
    //     case "closeTicketConfirm-kline":
    //         await ticket.closeTicketConfirm(interaction)
    //         break;

    //     //When user selects the "Cancel" button to reopen the semi-closed ticket
    //     case "reopenTicket-kline":
    //         await ticket.reopenTicket(interaction)
    //         break;

    //     //When user selects the "Close" button to confirm they want to close their ticket
    //     case "saveTicket-kline":
    //         await ticket.saveTicket(interaction)
    //         break;

    //     //When user selects the "Delete" button to confirm they want to Delete their ticket
    //     case "deleteTicket-kline":
    //         await ticket.deleteTicket(interaction)
    //         break;
    // }

    if (!interaction.isCommand()) return;

    switch (interaction.customID) {
        case "stock":
            inStockCommand(interaction.options._hoistedOptions[0].value, interaction)
            break;

        case "too-long":
            await automatedResponse(interaction, "none", "Unfortunately because your order is more than 30 days old, we're unable to honor our full replacement warranty. We realize this can be an inconvenience but there are certain factors that occur in the account lifespan that we cannot control. To make up for this, we would like to offer you a discount on replacements to get them significantly cheaper than retail")
            break;

        case "date-check":
            await dateCheck(interaction)
            break;

        case "replace-gmail":
            await automatedResponse(interaction, "361910844143173632", "A replacement will be in the works shortly. Please allow up to 48 hours for the replacement to be made. If you have any questions, feel free to ask and someone will assist you as soon as possible.")
            break;

        case "reverify-gmail":
            await automatedResponse(interaction, "361910844143173632", "A re-verification will be in the works shortly. Please export the effected Gmails in ***AYCD CSV Format*** if possible, include the proxy so we can keep the accounts healthy. Please allow up to 48 hours for the re-verification to be made. If you have any questions, feel free to ask and someone will assist you as soon as possible.")
            break;

        case "replace-amazon":
            await automatedResponse(interaction, "361910844143173632", "A replacement will be in the works shortly. Please allow up to 48 hours for the replacement to be made. If you have any questions, feel free to ask and someone will assist you as soon as possible.")
            break;

        case "replace-flx":
            await automatedResponse(interaction, "218746577248976906", "A replacement will be in the works shortly. Please allow up to 48 hours for the replacement to be made. If you have any questions, feel free to ask and someone will assist you as soon as possible.")
            break;




    }


});

client.on('message', async(msg) => {
    if (msg.author.bot) return;

    //SUCCESS TWEET
    if (msg.channelId == "844543753691463740" && msg.attachments.size > 0) {
        // send the message and wait for it to be sent
        const confirmation = await msg.reply(`Thanks for posting your success, ${msg.author}!`);
        return sendTweet(msg)
    }

    // if (msg.content.startsWith("!stock")) {
    //     await msg.reply("Hi")

    // }
});


async function dateCheck(message) {

    let order_id = message.content.split(" ")[1]

    let options = {
        'method': 'GET',
        'json': true,
        'headers': {
            'User-Agent': "test",
            'Authorization': 'RQepAUVv32dl6HqfpsR2CmTpLXdDgk2Rl139wcJuXS5hnAwGKU',
        }
    };

    const inventoryJson = await fetch(`https://shoppy.gg/api/v1/orders/${order_id}`, options);
    let order = await inventoryJson.json();
    let date_unformatted = order.paid_at
    let date = date_unformatted.split("T")[0]
    let pretty_date = date.split("-")[1] + "/" + date.split("-")[2] + "/" + date.split("-")[0]

    automatedResponse(message, `Order ID: ${order_id}\nProduct: ${order.product.title}\nDate: ${pretty_date}`)

}

async function automatedResponse(interaction, user, reason) {

    if (user == "none") {
        content_var = null
    } else {
        content_var = `<@${user}>`
    }


    let template = {
        "content": content_var,
        "embeds": [{
            "description": reason,
            "color": 16711767,
            "footer": {
                "text": "Kline Support",
                "icon_url": "https://i.imgur.com/unCJSO7.jpg"
            },
            "timestamp": "2022-06-09T04:36:00.000Z"
        }],
        "username": "Kline Services",
        "avatar_url": "https://i.imgur.com/unCJSO7.jpg",
        "attachments": []
    }

    interaction.channel.send(template)

}

async function inStockCommand(type, interaction) {

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
                "url": "https://klineaccounts.com/",
                "description": "Oneclick Gmails (With Proxy): [stocknum]\nOne-Click Gmail Accounts: [stocknum]\nFarmed Gmails (With Proxy): [stocknum]\nFarmed Gmail Accounts: [stocknum]\n\nAged Gmail Accounts: [stocknum]\nEDU Gmail Accounts: [stocknum]\nPrime EDU Gmail Accounts: [stocknum]\n\nForwarded Gmail Accounts (Pack of 21): [stocknum]\n\nAged Amazon Account: [stocknum]\nFresh BestBuy Accounts: [stocknum]\nFresh Target Account: [stocknum]\nFresh SSense Accounts: [stocknum]\nFresh Walmart Accounts: [stocknum]\n\nGold Nike Accounts: [stocknum]\nPlatinum Nike Accounts: [stocknum]\nGmail + Gold Combo: [stocknum]\nGmail + Platinum Combo: [stocknum]\n\nX2 FLX Accounts: [stocknum]\nX3 FLX Accounts: [stocknum]",
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
            template.embeds[1].description = "Gold Nike Accounts: [stocknum]\nPlatinum Nike Accounts: [stocknum]\nGmail + Gold Combo: [stocknum]\nGmail + Platinum Combo: [stocknum]"
            break;
        case "gmail":
            template.embeds[1].description = "Oneclick Gmails (With Proxy): [stocknum]\nOne-Click Gmail Accounts: [stocknum]\nFarmed Gmails (With Proxy): [stocknum]\nFarmed Gmail Accounts: [stocknum]\n\nAged Gmail Accounts: [stocknum]\nEDU Gmail Accounts: [stocknum]\nPrime EDU Gmail Accounts: [stocknum]\n\nForwarded Gmail Accounts (Pack of 21): [stocknum]\nForwarded Outlook/Microsoft Accounts: [stocknum]"
            break;
        case "retail":
            template.embeds[1].description = "Aged Amazon Account: [stocknum]\nFresh BestBuy Accounts: [stocknum]\nFresh Target Account: [stocknum]\nFresh SSense Accounts: [stocknum]\nFresh Walmart Accounts: [stocknum]"
            break;
        case "flx":
            template.embeds[1].description = "X2 FLX Accounts: [stocknum]\nX3 FLX Accounts: [stocknum]"

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

async function updateStock(type, interaction) {

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
                "title": "__***Kline Accounts Stock:***__",
                "url": "https://klineaccounts.com/",
                "description": "Oneclick Gmails (With Proxy): [stocknum]\nOne-Click Gmail Accounts: [stocknum]\nFarmed Gmails (With Proxy): [stocknum]\nFarmed Gmail Accounts: [stocknum]\n\nAged Gmail Accounts: [stocknum]\nEDU Gmail Accounts: [stocknum]\nPrime EDU Gmail Accounts: [stocknum]\n\nForwarded Gmail Accounts (Pack of 21): [stocknum]\n\nAged Amazon Account: [stocknum]\nFresh BestBuy Accounts: [stocknum]\nFresh Target Account: [stocknum]\nFresh SSense Accounts: [stocknum]\nFresh Walmart Accounts: [stocknum]\n\nGold Nike Accounts: [stocknum]\nPlatinum Nike Accounts: [stocknum]\nGmail + Gold Combo: [stocknum]\nGmail + Platinum Combo: [stocknum]\n\nX2 FLX Accounts: [stocknum]\nX3 FLX Accounts: [stocknum]",
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

    let stock_channel = await client.channels.cache.get("976883417352376330")

    stockMessage = (await stock_channel.guild.channels.cache.get("976883417352376330").messages.fetch({ "cache": true })).last()

    restockPing(stockMessage, template)

    if (stockMessage != undefined) {
        stockMessage.edit(template)
    } else {
        await client.channels.cache.get("976883417352376330").send(template)
    }
}

async function restockPing(stockMessage, template) {
    let newStock = template.embeds[1].description.split("\n")
    let oldStock = stockMessage.embeds[1].description.split("\n")
    let prodStockNew = -1
    let prodStockOld = -1
    let prodTitle = ""
    let userTagArray = []
    let userIDArray = []
    let roleArray = {
        "979482566975451196": [],
        "979482499648454686": [],
        "979482629114044509": [],
        "979482355708330014": [],
        "979482676916527165": []
    }



    for (product in newStock) {

        prodTitle = newStock[product].split(":")[0]
        prodStockNew = parseInt(newStock[product].split(":")[1])
        prodStockOld = parseInt(oldStock[product].split(":")[1])

        if (prodStockOld == 0 && prodStockNew > 0) { //
            switch (prodTitle) {

                case "Oneclick Gmails (With Proxy)":
                case "One-Click Gmail Accounts":
                case "Farmed Gmails (With Proxy)":
                case "Farmed Gmail Accounts":

                    roleArray["979482566975451196"].push(prodTitle)
                    break;

                case "EDU Gmail Accounts":
                case "Prime EDU Gmail Accounts":
                case "Aged Gmail Accounts":
                case "Forwarded Gmail Accounts (Pack of 21)":

                    roleArray["979482499648454686"].push(prodTitle)
                    break;

                case "Aged Amazon Account":
                case "Fresh BestBuy Accounts":
                case "Fresh Target Account":
                case "Fresh SSense Accounts":
                case "Fresh Walmart Accounts":

                    roleArray["979482629114044509"].push(prodTitle)
                    break;

                case "Gold Nike Accounts":
                case "Platinum Nike Accounts":
                case "Gmail + Gold Combo":
                case "Gmail + Platinum Combo":

                    roleArray["979482355708330014"].push(prodTitle)
                    break;

                case "X2 FLX Accounts":
                case "X3 FLX Accounts":

                    roleArray["979482676916527165"].push(prodTitle)
                    break;

                default:
                    break;
            }
        }
    }



    for (roles in roleArray) {

        if (roleArray[roles].length > 0) {

            let guild = await client.channels.cache.get("976883417352376330").guild
            await guild.members.fetch() //cache all members in the server
            const role = guild.roles.cache.find(role => role.id == roles) //the role to check
            userIDArray = role.members.map(m => m.id) // array of user IDs who have the role
            userTagArray = role.members.map(m => m.user.tag) // array of user objects who have the role

            for (user in userIDArray) {

                let productsRestocking = roleArray[roles].join(", ")

                //dm's the user with the restock message
                let userDM = await client.users.fetch(userIDArray[user])
                let template = {
                    "content": null,
                    "embeds": [{
                        "title": "Product Restock Notification",
                        "description": `This is an automated notification letting you know that ${productsRestocking} have restocked!\n\nClick the URL above to view our page and purchase any accounts. To stop recieving these messages, please head to <#979470736064401408> and un-react to the emoji. Thank you!`,
                        "url": "https://klineaccounts.com",
                        "color": 16711767,
                        "footer": {
                            "text": "Kline Accounts",
                            "icon_url": "https://i.imgur.com/unCJSO7.jpg"
                        }
                    }],
                    "username": "Kline Services",
                    "avatar_url": "https://i.imgur.com/unCJSO7.jpg",
                    "attachments": []
                }

                userDM.send(template)
                console.log(`Sent ${userTagArray[user]} a DM with a restock message.`)


                await client.channels.cache.get("958531791696834590").send(`${userTagArray[user]} has been notified of a ${productsRestocking} restock!`)
            }

        }
    }
}

async function alertSkill(order) {

    let template = {
        "content": "<@743578165384839280>",
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
    //client.login('ODg3ODY2MjA5NTc0NDc3ODg2.YUKX2A.yok34z8DHiM7iFu1m8eZKgz1nWU') //testing
    client.login('OTM4OTE1MDM3MDIyNjc1MDQ1.YfxOxQ.MauL-bwvGH2yz5iMkEIdae9WfIk') //production
        //ticket.ticket_setup()

};


login();

module.exports = {
    alertSkill,
    inStockCommand,
    sendTweet,
    createACOForm,
    updateStock,
    restockPing
}