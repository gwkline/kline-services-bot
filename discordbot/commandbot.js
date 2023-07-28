const Discord = require("discord.js");
const { google } = require("googleapis");
const config = require("../config.json");
const utils = require("../utils");
const fetch = require('node-fetch');
require("dotenv").config();

const client = new Discord.Client({
    disableEveryone: true,
    partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
    intents: ['GUILD_MEMBERS', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES']
});

client.on("ready", async (e) => {
    console.log("Successfully logged in")
    client.user.setStatus('available')
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "Listening for &[command]",
            type: 'PLAYING'
        }
    })

    //setInterval(updateStock, 1000 * 10)
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "stock") {
        inStockCommand(interaction.options._hoistedOptions[0].value, interaction)
        return;
    }

    if (interaction.commandName === "check") {
        dateCheck(interaction.options.get("order_id").value, interaction)
        return;
    }

    //     if (interaction.commandName === "ticket") {
    //   console.log(`Setting up ticket channels for server: ${msg.guild.name}, ID: ${msg.guild.id}`)
    //   return await ticket.ticket_setup(msg.guild)
    //     }

    switch (interaction.options._hoistedOptions[0].value) {

        case "replace-gmail":
            await automatedResponse(interaction, "361910844143173632", "replace-gmail")
            break;

        case "reverify-gmail":
            await automatedResponse(interaction, "361910844143173632", "reverify-gmail")
            break;

        case "replace-amazon":
            await automatedResponse(interaction, "361910844143173632", "replace-amazon")
            break;

        case "replace-flx":
            await automatedResponse(interaction, "218746577248976906", "replace-flx")
            break;

        case "too-long":
            await automatedResponse(interaction, "361910844143173632", "too-long")
            break;

        case "not-oc":
            await automatedResponse(interaction, "none", "not-oc")
            break;




    }


});

client.on('messageCreate', async (msg) => {

    //Checkout Webhooks
    if (msg.channelId == "906613922830880768") {

        let values = [convertEpochToSpecificTimezone(msg.createdTimestamp, -4)]
        let holder = msg.embeds[0].fields

        for (i = 0; i < holder.length; i++) {
            values.push(holder[i].value.replaceAll("||", ""))
        }


        let [timestamp, hit_for, sku, shoe, size, order_num, email, proxy, card, profile, address] = [values[0], values[14].split(" ")[0], values[7], values[1], values[2], values[9], values[10], values[11].replaceAll("http://", "").replace("/", ""), values[12], values[14], values[15]]
        console.log([timestamp, hit_for, sku, shoe, size, order_num, email, proxy, card, profile, address])

        const masterSpreadsheetId = process.env.GOOGLE_SHEET_ID_MASTER;
        const chrisSpreadsheetId = process.env.GOOGLE_SHEET_ID_CHRIS;

        await logCheckout([timestamp, hit_for, sku, shoe, size, order_num, email, proxy, card, profile, address, "In Transit"], hit_for, masterSpreadsheetId)

        if (hit_for == "Chris") {
            await logCheckout([timestamp, sku, shoe, size, order_num, email, address, "In Transit"], "Master", chrisSpreadsheetId)
        }

    }

    //Decline Webhooks
    if (msg.channelId == "999573736099418226") {

        let values = [convertEpochToSpecificTimezone(msg.createdTimestamp, -4)]
        let holder = msg.embeds[0].fields

        for (i = 0; i < holder.length; i++) {
            values.push(holder[i].value.replaceAll("||", ""))
        }

        let [timestamp, hit_for, shoe, size, email, proxy, card, profile] = [values[0], values[9].split(" ")[0], values[1], values[2], values[7], values[8].replaceAll("http://", "").replace("/", ""), values[9], values[10]]

        await logCheckout([timestamp, hit_for, shoe, size, email, proxy, card, profile], "Declines", "14S40-mJoJ8pZSS7Ot7RWJUOhCBm7r7b-occJnf2A-1Y")
    }

    if (msg.author.bot) return;
    if (!client.application.owner) await client.application.fetch();


    roles = msg.mentions.roles
    if (roles.size == 0) {
        //
    } else {

        role = roles.first().id
        if (role == "1036813184482414692") {

            let userIds = [
                "315179809619836928", //Jayy
                "684482805866168379", //Grant
                "631566009471336448", //Chris
                "654784227858055197"  //Jake
            ]
            for (users in userIds) {
                try {
                    let user = await client.users.fetch(userIds[users]);
                    console.log(userIds[users])
                    user.send(`<@${msg.author.id}> mentioned you in <#${msg.channel.id}>`);
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }

    //Suggestions
    if (msg.channelId == "785553745433591808" && msg.author.id != "361910844143173632") {
        // send the message and wait for it to be sent
        await msg.react("✅")
        await msg.react("❌")
    }

    //Success
    if (msg.channelId == "844543753691463740" && msg.attachments.size > 0) {
        await msg.reply(`Thanks for posting your success, ${msg.author}!`);
    }

    if (msg.content.toLowerCase().includes('!deploy') && msg.author.id === client.application.owner.id) {
        msg.reply('Deploying...')
        const support_command = {
            "name": "support",
            "description": "Respond to customer issues",
            "options": [{
                "name": "selection",
                "type": "STRING",
                "description": "Which issue to address",
                "required": true,
                "choices": [{
                    "name": "Replace Gmail",
                    "value": "replace-gmail"
                },
                {
                    "name": "Reverify Gmail",
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
                },
                {
                    "name": "Not Oneclick Yet",
                    "value": "not-oc"
                }
                ]
            }]
        }
        const stock_command = {
            "name": "stock",
            "description": "Check our stock levels!",
            "options": [{
                "name": "selection",
                "type": "STRING",
                "description": "The products you would like to view",
                "required": true,
                "choices": [{
                    "name": "View All",
                    "value": "view_all"
                },
                {
                    "name": "Gmail",
                    "value": "gmail"
                },
                {
                    "name": "Nike",
                    "value": "nike"
                },
                {
                    "name": "Retail",
                    "value": "retail"
                },
                {
                    "name": "FLX",
                    "value": "flx"
                }
                ]
            }]
        }
        const check_command = {
            "name": "check",
            "description": "Check the status of an order",
            "options": [{
                "type": 3,
                "name": "order_id",
                "description": "Please enter the Order ID",
                "required": true
            }]
        }
        await client.application.commands.create(check_command);
        await client.application.commands.create(support_command);
        await client.application.commands.create(stock_command);
    }
});

async function logCheckout(row, sheetName, spreadsheetId) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                row
            ],
        },
    });
}

async function dateCheck(order_id, interaction) {

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

    let template
    if (order.paid_at == null) {
        let date_unformatted = order.created_at
        let date = date_unformatted.split("T")[0]
        let pretty_date = date.split("-")[1] + "/" + date.split("-")[2] + "/" + date.split("-")[0]
        template = {
            "content": null,
            "embeds": [{
                "title": "__Order Checker__",
                "description": "** **",
                "color": 16711767,
                "fields": [{
                    "name": "Order Date:",
                    "value": `${pretty_date}`,
                },
                {
                    "name": "Account Type:",
                    "value": `${order.product.title}`
                },
                {
                    "name": "Order Quantity:",
                    "value": `${order.quantity}`
                },
                {
                    "name": "Payment Method:",
                    "value": `${order.gateway}`
                },
                {
                    "name": "Payment Status:",
                    "value": `Not paid yet / not updated`
                }
                ],
                "footer": {
                    "text": "Kline Services",
                    "icon_url": "https://i.imgur.com/unCJSO7.jpg"
                },
                "timestamp": `${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`
            }],
            "username": "Kline Services",
            "avatar_url": "https://i.imgur.com/unCJSO7.jpg",
            "attachments": []
        }
    } else {
        let date_unformatted = order.paid_at
        let date = date_unformatted.split("T")[0]
        let pretty_date = date.split("-")[1] + "/" + date.split("-")[2] + "/" + date.split("-")[0]
        template = {
            "content": null,
            "embeds": [{
                "title": "__Order Checker__",
                "description": "** **",
                "color": 16711767,
                "fields": [{
                    "name": "Order Date:",
                    "value": `${pretty_date}`,
                },
                {
                    "name": "Account Type:",
                    "value": `${order.product.title}`
                },
                {
                    "name": "Order Quantity:",
                    "value": `${order.quantity}`
                },
                {
                    "name": "Payment Method:",
                    "value": `${order.gateway}`
                },
                {
                    "name": "Payment Status:",
                    "value": `Paid`
                }
                ],
                "footer": {
                    "text": "Kline Services",
                    "icon_url": "https://i.imgur.com/unCJSO7.jpg"
                },
                "timestamp": `${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`
            }],
            "username": "Kline Services",
            "avatar_url": "https://i.imgur.com/unCJSO7.jpg",
            "attachments": []
        }
    }

    interaction.reply(template)

}

async function automatedResponse(interaction, user, reason) {
    const reasons = {
        "too-long": "Unfortunately because your order is more than 30 days old, we're unable to honor our full replacement warranty. We realize this can be an inconvenience but there are certain factors that occur in the account lifespan that we cannot control. To make up for this, we would like to offer you a discount on replacements to get them significantly cheaper than retail, if this is something you are interested please tag gkline#2534.",
        "replace-gmail": "A replacement will be in the works shortly. Please allow up to 48 hours for the replacement to be made. If you have any questions, feel free to ask and staff will assist you as soon as possible.",
        "reverify-gmail": "A re-verification will be in the works shortly. Please export the effected Gmails in ***AYCD CSV Format*** if possible, and include the proxy you've been using so we can keep the accounts healthy. Please allow up to 48 hours for the re-verification to be made. If you have any questions, feel free to ask and staff will assist you as soon as possible.",
        "replace-amazon": "A replacement will be in the works shortly. Please allow up to 48 hours for the replacement to be made. If you have any questions, feel free to ask and staff will assist you as soon as possible.",
        "replace-flx": "A replacement will be in the works shortly. Please allow up to 48 hours for the replacement to be made. If you have any questions, feel free to ask and staff will assist you as soon as possible.",
        "not-oc": "Unfortunately we generally don't do replacements on our Oneclick Gmails because they're farmed for over a month in most cases and are tested multiple times to ensure they are true Oneclicks. If you would like, staff can look over your farming setup and give you suggestion on how to improve account help. If this is the case, please ping gkline#2534."
    }

    let thisReason = reasons[reason]
    if (reason == "replace-gmail" || reason == "reverify-gmail" || reason == "replace-amazon" || reason == "replace-flx") {
        interaction.channel.setName(reason)
    }


    if (user == "none") {
        content_var = null
    } else {
        content_var = `<@${user}>`
    }


    let template = {
        "content": null,
        "embeds": [{
            "description": thisReason,
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
    //delete the last message in a channel
    await client.channels.cache.get(interaction.channel.id).send(template)
    if (content_var != null) {
        await client.channels.cache.get(interaction.channel.id).send(`Pinging staff: ${content_var}`)
    }

    execute(interaction)

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
            },
            "timestamp": `${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`

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
            "description": "X3 FLX Accounts (0-100k): [stocknum]\nX3 FLX Accounts (100k-250k): [stocknum]\nX3 FLX Accounts (250k-350k): [stocknum]\nX3 FLX Accounts (350k-500k): [stocknum]\nX3 FLX Accounts (500k-750k): [stocknum]\nX3 FLX Accounts (750k+): [stocknum]\nAged Amazon Account: [stocknum]",
            "color": 15868505,
            "image": {
                "url": "https://i.imgur.com/GCNBr54.png"
            },
            "thumbnail": {
                "url": "https://i.imgur.com/M5w2jAS.png"
            },
            "timestamp": `${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`
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

                case "X3 FLX Accounts (750k+)":
                case "X3 FLX Accounts (500k-750k)":
                case "X3 FLX Accounts (350k-500k)":
                case "X3 FLX Accounts (250k-350k)":
                case "X3 FLX Accounts (100k-250k)":
                case "X3 FLX Accounts (0-100k)":


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

async function execute(interaction) {
    await interaction.reply({
        content: `.`,
    });
    await interaction.deleteReply();
    //await interaction.channel.send(interaction.options.getString("string"));
}

const sendTweet = async (msg) => {
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
    client.login(process.env.DISCORD_BOT_TOKEN)
}

// async function fuck() {
//     let channel = await client.channels.fetch("906613922830880768")
//     let messages = await channel.messages.fetch({ limit: 100 });
//     messages = [...messages].reverse()

//     var counter = 0;
//     var limit = 99;
//     let values = []
//     var myVar = setInterval(function () {
//         if (counter > limit) {
//             clearInterval(myVar);
//         }
//         values = [convertEpochToSpecificTimezone(messages[counter][1].createdTimestamp, -4)]
//         counter++;
//         let holder = messages[counter][1].embeds[0].fields
//         for (i = 0; i < holder.length; i++) {
//             if (i == 2 || i == 3 || i == 4 || i == 9) {
//                 //
//             } else if (i == 10) {
//                 values.push(holder[i].value.replaceAll("||", "").split(" ")[0])
//                 values.push(holder[i].value.replaceAll("||", ""))
//             }
//             else {
//                 values.push(holder[i].value.replaceAll("||", ""))
//             }
//         }
//         values = [values[0], values[7], values[1], values[2], values[3].replace(" ", ""), values[4].replace('\n', ""), values[5].replaceAll("http://", "").replace("/", ""), values[6], values[8], values[9]]


//         logCheckout(values)
//     }, 1200);

// }

function convertEpochToSpecificTimezone(timeEpoch, offset) {
    var d = new Date(timeEpoch);
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    var nd = new Date(utc + (3600000 * offset));
    return nd.toLocaleString();
}

login();

module.exports = {
    alertSkill,
    inStockCommand,
    sendTweet,
    updateStock,
    restockPing
}
