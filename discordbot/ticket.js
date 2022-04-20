
//This is how a server owner can initialize the ticket bot
//TODO: Allow server owner to set own channel/role names
//TODO: Check that command is sent from server owner

// case "ticket":
//   print(`Setting up ticket channels for server: ${msg.guild.name}, ID: ${msg.guild.id}`)
//   return await ticket.ticket_setup(msg.guild)

const Discord = require("discord.js");
const config = require("../config/config.json");
require("dotenv").config();
const { sendRequest, patchRequest, getRequest, randomArrayShuffle, print, getInfoFromMessage } = require("../utils")


//Responsible for checking if the captcha related channels exist in a passed guild
//If the channels do not exist, they are created
async function ticket_setup(guild) {

    //Get the guild_info object from the Whop DB
    let guild_info = await getRequest(`discord_servers/${guild.id}`)

    //TODO: DELETE LATER
    guild_info.ticket_channel = "960071390856372225"
    guild_info.open_ticket_category = "960072168870391808"
    guild_info.closed_ticket_category = "960072169356922930"
    guild_info.support_roles = ["960066633286709278", "960066753105391649", "960066807434194944"]


    print("Setting up categories")

    //If the DB does not have a set open ticket category ID, a new category is created
    if (!guild_info.open_ticket_category) {
        print("No open ticket category in DB, creating a new one")

        openTicketOverwrites = [
            {
                id: guild.roles.everyone,
                deny: ["VIEW_CHANNEL"],
                allow: ["SEND_MESSAGES", "CONNECT"]
            }]

        for (let i = 0; i < guild_info.support_roles.length; i++) {
            openTicketOverwrites.push({
                id: guild_info.support_roles[i],
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT"],
            })
        }

        guild_info.open_ticket_category = (await guild.channels.create("Open Tickets", {
            type: "GUILD_CATEGORY",
            openTicketOverwrites
        }))

        print(guild_info.open_ticket_category)
    }
    //If the DB does have a set open ticket category ID, check that it still exists 
    else {

        //Search by ID
        if (guild.channels.cache.find((channel) => (channel.id == guild_info.open_ticket_category))) {
            print("Found open ticket category by ID query")
        }

        //If ID query does not work, search by name
        else if (guild.channels.cache.find((channel) => (channel.name === "Open Tickets"))) {
            print("Found open ticket category by name query")
            guild_info.open_ticket_category = (guild.channels.cache.find((channel) => (channel.name === "Open Tickets"))).id
        }

        //If neither query works, create a new channel
        else {

            print("Open ticket category in DB is corrupted, creating a new one")
            openTicketOverwrites = [
                {
                    id: guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"],
                    allow: ["SEND_MESSAGES", "CONNECT"]
                }]

            for (let i = 0; i < guild_info.support_roles.length; i++) {
                openTicketOverwrites.push({
                    id: guild_info.support_roles[i],
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT"]
                })
            }

            guild_info.open_ticket_category = (await guild.channels.create("Open Tickets", {
                type: "GUILD_CATEGORY",
                openTicketOverwrites
            })).id

        }
    }

    //If the DB does not have a set closed ticket category ID, a new category is created
    if (!guild_info.closed_ticket_category) {
        print("No closed ticket category in DB, creating a new one")

        closedTicketOverwrites = [
            {
                id: guild.roles.everyone,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT"],
            }]

        for (let i = 0; i < guild_info.support_roles.length; i++) {
            closedTicketOverwrites.push({
                id: guild_info.support_roles[i],
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT"],
            })
        }

        guild_info.closed_ticket_category = (await guild.channels.create("Closed Tickets", {
            type: "GUILD_CATEGORY",
            closedTicketOverwrites
        })).id
    }
    //If the DB does have a set closed ticket category ID, check that it still exists 
    else {

        //Search by ID
        if (guild.channels.cache.find((channel) => (channel.id == guild_info.closed_ticket_category))) {
            print("Found closed ticket category by ID query")
        }

        //If ID query does not work, search by name
        else if (guild.channels.cache.find((channel) => (channel.name === "Closed Tickets"))) {
            print("Found closed ticket category by name query")
            guild_info.closed_ticket_category = (guild.channels.cache.find((channel) => (channel.name === "Closed Tickets"))).id
        }

        //If neither query works, create a new channel
        else {

            print("Closed ticket category in DB is corrupted, creating a new one")
            closedTicketOverwrites = [
                {
                    id: guild.roles.everyone,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT"],
                }]

            for (let i = 0; i < guild_info.support_roles.length; i++) {
                closedTicketOverwrites.push({
                    id: guild_info.support_roles[i],
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT"],
                })
            }

            guild_info.closed_ticket_category = (await guild.channels.create("Closed Tickets", {
                type: "GUILD_CATEGORY",
                closedTicketOverwrites
            })).id

        }
    }

    //If the DB does not have a set ticket channel ID, a new channel is created
    if (!guild_info.ticket_channel) {

        print("No ticket channel in DB, creating a new one")
        guild_info.ticket_channel = (await guild.channels.create("tickets", {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    allow: ["VIEW_CHANNEL"],
                    deny: ["SEND_MESSAGES", "CONNECT"]
                },
            ]
        })).id
    }

    //If the DB does have a set ticket channel ID, check that it still exists 
    else {

        //Search by ID
        if (guild.channels.cache.find((channel) => (channel.id == guild_info.ticket_channel))) {
            print("Found ticket channel by ID query")
        }

        //If ID query does not work, search by name
        else if (guild.channels.cache.find((channel) => (channel.name === "tickets"))) {
            print("Found ticket channel by name query")
            guild_info.ticket_channel = (guild.channels.cache.find((channel) => (channel.name === "tickets"))).id
        }

        //If neither query works, create a new channel
        else {

            print("Ticket channel in DB is corrupted, creating a new one")
            guild_info.ticket_channel = (await guild.channels.create("tickets", {
                type: "GUILD_TEXT",
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: ["VIEW_CHANNEL"],
                        deny: ["SEND_MESSAGES", "CONNECT"]
                    },
                ]
            })).id

        }
    }

    //Updated guild_info object is passed back to the caller
    await patchRequest(`discord_servers/${guild.id}`, guild_info)

    //Once the verification channel ID is known, the embed is sent to it (if it doesn't already exist)
    await sendTicketEmbed(guild, guild_info.ticket_channel)

}

//Responsible for checking if the ticket embed exists in a passed channel
async function sendTicketEmbed(guild, ticket_channel) {

    //Checks if the ticket embed is already set up in the channel
    //The bot looks for the first message sent in the channel
    let ticket_message = undefined
    if (ticket_channel != null) {
        ticket_message = (await guild.channels.cache.get(ticket_channel).messages.fetch({ "cache": true })).last()
    }

    //If the verification embed is not set up, it is created
    if (ticket_message == undefined) {
        let template = {
            "content": null,
            "embeds": [
                {
                    "title": config.TicketEmbedTitle,
                    "description": config.TicketEmbedDescription,
                    "color": config.TicketEmbedColor,
                    "thumbnail": {
                        "url": config.TicketEmbedThumbnail
                    }
                }
            ],
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Open a ticket",
                            "style": 1,
                            "custom_id": "openTicket-whop"
                        },

                    ]
                }
            ],
        }

        print("Verification embed not found - creating")
        await guild.channels.cache.get(ticket_channel).send(template)
        return

    }

    //If the first message in a channel does not belong to the bot
    else if (ticket_message.author.id != config.WHOP_BOT_ID) {
        print("Verification embed is set incorrectly. Please make sure nobody else can message in the channel.")
        return
    }

    //If the verification embed is found and belongs to the bot
    else {
        print("Verification embed is set correctly.")
        return
    }
}

//Responsible for creating a new ticket channel and embed
//The embed is sent to the ticket channel
//The ticket channel is made in the open ticket category
async function makeTicket(interaction) {
    //Get the guild_info object from the Whop DB
    let guild_info = await getRequest(`discord_servers/${interaction.guild.id}`)

    //TODO: DELETE LATER
    guild_info.ticket_channel = "960071390856372225"
    guild_info.open_ticket_category = "960072168870391808"
    guild_info.closed_ticket_category = "960072169356922930"
    guild_info.support_roles = ["960066633286709278", "960066753105391649", "960066807434194944"]
    guild_info.ticket_counter = 1

    newTicketChannel = (await interaction.guild.channels.create(`${interaction.user.username}-ticket-${guild_info.ticket_counter}`, {
        type: "GUILD_TEXT",
        parent: interaction.guild.channels.cache.find((channel) => (channel.name === "Open Tickets")),
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT"],
            },

        ]
    })).id


    NewTicketEmbedDescription = `Welcome <@${interaction.user.id}>! Please be patient, staff will be with you shortly!\n\n`

    let template = {
        "content": null,
        "embeds": [
            {
                "title": config.NewTicketEmbedTitle,
                "description": NewTicketEmbedDescription,
                "color": config.NewTicketEmbedColor,
                "thumbnail": {
                    "url": config.NewTicketEmbedThumbnail
                }
            }
        ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Close Ticket 🔒",
                        "style": 1,
                        "custom_id": "closeTicket-whop"
                    },


                ]
            }
        ],
    }

    await interaction.guild.channels.cache.get(newTicketChannel).send(template)



    interaction.reply({
        content: null,
        embeds: [
            {
                "title": "Ticket Created",
                "description": `Your ticket has been created. You can view it here: <#${newTicketChannel}>`,
                "color": config.TicketEmbedColor,
                "thumbnail": {
                    "url": config.TicketEmbedThumbnail
                }
            }
        ],
        ephemeral: true,
    });


    guild_info.ticket_counter += 1
    await patchRequest(`discord_servers/${interaction.guild.id}`, guild_info)


}

async function closeTicket(interaction) {
    //Get the guild_info object from the Whop DB
    let guild_info = await getRequest(`discord_servers/${interaction.guild.id}`)

    let template = {
        "content": null,
        "embeds": [
            {
                "description": "Are you sure you want to close this ticket?",
                "color": config.NewTicketEmbedColor,
            }
        ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Close",
                        "style": 4,
                        "custom_id": "closeTicketConfirm-whop"
                    },
                    {
                        "type": 2,
                        "label": "Cancel",
                        "style": 2,
                        "custom_id": "reopenTicket-whop"
                    },


                ]
            }
        ],
    }

    interaction.deferUpdate()
    await interaction.channel.send(template)

}

async function closeTicketConfirm(interaction) {
    //Get the guild_info object from the Whop DB
    let guild_info = await getRequest(`discord_servers/${interaction.guild.id}`)

    let template = {
        "content": null,
        "embeds": [
            {
                "description": `Ticket closed by <@${interaction.user.id}>`,
                "color": config.NewTicketEmbedColor,

            }
        ],
        "components": [],
    }

    interaction.update(template)

    let templateTwo = {
        "content": null,
        "embeds": [
            {
                "description": `Transcript sent to <@${interaction.user.id}>`,
                "color": config.NewTicketEmbedColor,

            }
        ],
        "components": [],
    }

    originalMessage = (await interaction.channel.messages.fetch({ "cache": true })).last()
    originalOwner = originalMessage.embeds[0].description.split(" ")[1].split("@")[1].split(">")[0]
    originalOwnerUser = await interaction.guild.members.fetch(originalOwner)

    saveTicket(interaction, originalOwnerUser)

    await interaction.channel.send(templateTwo)

    await interaction.channel.permissionOverwrites.edit(originalOwnerUser, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
    })

    await interaction.channel.setParent(await interaction.guild.channels.cache.find((channel) => (channel.name === "Closed Tickets")), { lockPermissions: false })
    //interaction.channel.lockPermissions()

    let templateThree = {
        "content": null,
        "embeds": [
            {
                "description": "`Support Team Ticket Controls`",
                "color": config.NewTicketEmbedColor,
            }
        ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Save Ticket",
                        "style": 2,
                        "custom_id": "saveTicket-whop"
                    },
                    {
                        "type": 2,
                        "label": "Reopen Ticket",
                        "style": 2,
                        "custom_id": "reopenTicket-whop"
                    },
                    {
                        "type": 2,
                        "label": "Delete Ticket",
                        "style": 2,
                        "custom_id": "deleteTicket-whop"
                    },


                ]
            }
        ],
    }

    interaction.channel.send(templateThree)

}

async function reopenTicket(interaction) {
    originalMessage = (await interaction.channel.messages.fetch({ "cache": true })).last()
    originalOwner = originalMessage.embeds[0].description.split(" ")[1].split("@")[1].split(">")[0]
    originalOwnerUser = await interaction.guild.members.fetch(originalOwner)

    await interaction.channel.permissionOverwrites.edit(originalOwnerUser, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
    })

    let template = {
        "content": null,
        "embeds": [
            {
                "description": `<@${originalOwner}>, your ticket has been reopened`,
                "color": config.NewTicketEmbedColor,
            }
        ],
        "components": [],
        "mentions": [originalOwner]
    }

    await interaction.channel.setParent(await interaction.guild.channels.cache.find((channel) => (channel.name === "Open Tickets")), { lockPermissions: true })
    //interaction.deferUpdate()
    interaction.message.delete()
    interaction.reply(template)
}
async function saveTicket(interaction, originalOwner) {

}
async function deleteTicket(interaction) {
    await interaction.channel.delete()
}


module.exports = {
    sendTicketEmbed,
    ticket_setup,
    makeTicket,
    closeTicket,
    closeTicketConfirm,
    reopenTicket,
    saveTicket,
    deleteTicket,
}