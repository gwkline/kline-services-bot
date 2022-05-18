
// case "ticket":
//   print(`Setting up ticket channels for server: ${msg.guild.name}, ID: ${msg.guild.id}`)
//   return await ticket.ticket_setup(msg.guild)

const Discord = require("discord.js");
const config = require("../config/config.json");
require("dotenv").config();
const { sendRequest, patchRequest, getRequest, randomArrayShuffle, print, getInfoFromMessage } = require("../utils")

let guild_info = []
guild_info.ticket_channel = "968016088635945020"
guild_info.open_ticket_category = "968015993416855562"
guild_info.closed_ticket_category = "968016039617105970"
guild_info.support_roles = ["785355393995767855", "785355393995767854", "959628440875712512"]
guild_info.ticket_counter = 1



//Responsible for checking if the captcha related channels exist in a passed guild
//If the channels do not exist, they are created
async function ticket_setup(guild) {

    //Get the guild_info object from the Whop DB

    // //TODO: DELETE LATER

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
                    "image": {
                        "url": config.TicketEmbedImage
                    },
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
                            "custom_id": "openTicket-kline"
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


    NewTicketEmbedDescription = `Welcome <@${interaction.user.id}>! Please be patient, staff will be with you shortly! While you wait, we have a few questions to help make this process as quick and simple as possible.\n\n`

    let template = {
        "content": null,
        "embeds": [
            {
                "title": config.NewTicketEmbedTitle,
                "description": NewTicketEmbedDescription,
                "color": config.NewTicketEmbedColor,
                "thumbnail": {
                    "url": config.ticketEmbedThumbnail
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
                        "custom_id": "closeTicket"
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

    let templateQ1 = {
        "content": null,
        "embeds": [
            {
                "title": "Question 1: Are you having issues with your accounts?",
                "description": "Please select the corresponding buttons below.",
                "color": config.NewTicketEmbedColor,
                "thumbnail": {
                    "url": config.ticketEmbedThumbnail
                }
            }
        ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Yes",
                        "style": 3,
                        "custom_id": "accountIssue-kline"
                    },
                    {
                        "type": 2,
                        "label": "No",
                        "style": 4,
                        "custom_id": "q1no-kline"
                    },
                ]
            }
        ],
    }

    interaction.guild.channels.cache.get(newTicketChannel).send(templateQ1)

}

async function q2(interaction) {
    let templateQ2 = {
        "content": null,
        "embeds": [
            {
                "title": "Question 2: Did you just purchase accounts and were told to open a ticket for delivery?",
                "description": "Please select the corresponding buttons below.",
                "color": config.NewTicketEmbedColor,
                "thumbnail": {
                    "url": config.ticketEmbedThumbnail
                }
            }
        ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Yes",
                        "style": 3,
                        "custom_id": "accountDelivery-kline"
                    },
                    {
                        "type": 2,
                        "label": "No",
                        "style": 4,
                        "custom_id": "generalQuestion-kline"
                    },
                ]
            }
        ],
    }
    interaction.guild.channels.cache.get(newTicketChannel).send(templateQ2)
}

async function accountIssue(interaction) {

    //delete the message connected to the reaction
    await interaction.message.delete()

    let template = {
        "content": null,
        "embeds": [
            {
                "title": "Account Issue",
                "description": "Please paste your order ID below",
                "color": config.TicketEmbedColor,
                "thumbnail": {
                    "url": config.ticketEmbedThumbnail
                },
            }
        ],

    }

    await interaction.channel.send(template)

    // Create a message collector
    const filter = m => m.content.length == 36;
    const collector = channel.createMessageCollector({ filter, time: 1000000 });
    collector.on('collect', m => console.log(`Collected ${m.content}`));
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
}

async function accountDelivery(interaction) {

}

async function generalQuestion(interaction) {

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
                        "custom_id": "closeTicketConfirm-kline"
                    },
                    {
                        "type": 2,
                        "label": "Cancel",
                        "style": 2,
                        "custom_id": "reopenTicket-kline"
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
                        "custom_id": "saveTicket-kline"
                    },
                    {
                        "type": 2,
                        "label": "Reopen Ticket",
                        "style": 2,
                        "custom_id": "reopenTicket-kline"
                    },
                    {
                        "type": 2,
                        "label": "Delete Ticket",
                        "style": 2,
                        "custom_id": "deleteTicket-kline"
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
    q2,
    accountIssue,
    generalQuestion,
    accountDelivery,
}