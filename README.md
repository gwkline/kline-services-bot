# Sneaker Reselling Side Hustle Platform

This project is a custom-built web platform used to facilitate my sneaker reselling and account selling business, including my custom-built website, a personal Discord bot, and a bunch of tools I used to make my customer and I's lives easier. It's mainly built using Vanilla JavaScript/NodeJS, and is currently hosted on Heroku. The account website can be found at: https://klineaccounts.com

## Project Structure

This platform consists of several major components:

#### Express Server:

The main `index.js` file contains an Express server that serves different purposes:

- Routing users to my account selling website
- Receiving and logging new order information from my storefront to a Google Sheet
- Implementing Discord OAuth to tailor the user experience based on
  their Discord membership status

#### Discord Bot:

The `./discordbot/commandbot.js` file contains the logic for a personal Discord bot. Despite how disorganized the code is, the bot offers several features such as:

- Enabling customers to check account stock numbers via a Discord command
- Providing macros and support tools for better customer service
- Automated notifications to users about restocked accounts
- Prototype support ticket system that clones the functionality of popular ticket tools

#### Discord Authentication:

The `./discordauth/discordAuth.js` file is responsible for Discord OAuth implementation. Depending on the verification status, it sets secure cookies which control the version of the website that users see.

## Key Features

- **Google Sheets Integration:** The integration with the Google Sheets API serves as the backbone for transaction logging from my storefront provider, Shoppy.gg, as well as handling order logging for the autocheckout service I run.
- **Discord OAuth:** Discord OAuth implementation plays a vital role in the account website, altering the website display based on the user's membership status. This was my first time implementing OAuth, and ended up working pretty well after some trial and error.
- **Discord Bot Development:** The heart of the platform is the feature-packed Discord bot. With complex bot logic to its name, the bot facilitates real-time interaction, automation, and brings the messaging platform into the mix.
- **Automated Notification System:** The bot's prowess extends to sending automated DMs to users about restocked items. The feature stands out for its emphasis on automation, real-time notifications, and user subscription systems.
- **Prototype Support Ticket System:** The platform houses a prototype of a customer support ticket system mimicking the functionalities of well-known ticket tools. It offers a glimpse into the management of customer support within a Discord environment.

## Conclusion

Despite the seemingly chaotic assortment of its nature, this project helped me automate a lot of the chores I never seemed to want to do. This was probably my first big personal project, and while the code seems pretty gross in hindsight, I'm still proud of what I was able to build with minimal experience. I've left this project mostly as-is since going public, including old comments and logic, so enjoy!
