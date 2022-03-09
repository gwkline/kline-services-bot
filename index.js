const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 50000
const { google } = require("googleapis");
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const console = require('console');
const commandbot = require("./discordbot/commandbot");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


let WHITELIST = [
    "Fresh BestBuy Accounts",
    "Fresh SSense Accounts",
    "Fresh Walmart Accounts",
    "Fresh Target Account",
    "Fresh Outlook Combo Accounts",
    "Forwarded Outlook/Microsoft Accounts",
    "106 Pack of Forwarded Gmails"
]


app.get('/', (req, res) => {

    res.status(200).sendFile(path.join(__dirname, './public/index.html'));

    // if (req.cookies.id_token != null && req.cookies.id_token != "invalid") {
    //     console.log("Valid Cookie");
    //     res.status(200).sendFile(path.join(__dirname, './discordauth/index.html'));
    // } else if (req.cookies.id_token == "invalid") {
    //     console.log("Not in server");
    //     res.status(200).sendFile(path.join(__dirname, './discordauth/index.html'));
    //     //non_member_index.html
    // } else {
    //     console.log("Needs login token");
    //     res.status(200).sendFile(path.join(__dirname, './discordauth/index.html'));
    //     //loginindex.html
    // }
});

app.post('/api/log-order', async(req, res) => {
    try {
        console.log(await logOrder(req.body))
        res.sendStatus(200);

    } catch {
        res.sendStatus(500)
    }
});

async function logOrder(body) {


    if (body.event != "order:paid") {
        return `Event: ${body.event}`
    } else {

        let orders = body["data"]["order"]
        let timestamp = orders["paid_at"]
        let timeArr = ""
        let timeArrTwo = ""
        if (!(timestamp == null)) {
            timeArr = timestamp.split('T')
            timeArrTwo = timeArr[1].split(".")
        }

        let oid = orders["id"]
        let email = orders["email"]
        let product = orders["product"]["title"]
        let quantity = orders["quantity"]
        let custom_field = "N/A"
        let price = ((orders["quantity"] * orders["price"]) * 0.971) - 0.3

        if (WHITELIST.includes(product)) {
            if (orders["custom_fields"].length != 0) {
                custom_field = orders["custom_fields"][0]["value"]

            }

            switch (product) {
                case "Forwarded Outlook/Microsoft Accounts":

                    let smsCost = 5 * quantity / await convertCurrency()
                    payout = (price * .7) - smsCost
                    break;

                default:
                    payout = price * .7
                    break;
            }
        }



        let order = {
            "Timestamp": `${timeArr[0]} ${timeArrTwo[0]} `,
            "Order_ID": oid,
            "Email": email,
            "Product": product,
            "Quantity": quantity,
            "Custom_Field": custom_field,
            "Price": price,
            "Payout": payout

        }

        if (WHITELIST.includes(orders.product.title)) {

            commandbot.alertSkill(order)
            const auth = new google.auth.GoogleAuth({
                keyFile: "./config/credentials.json",
                scopes: "https://www.googleapis.com/auth/spreadsheets",
            });
            const client = await auth.getClient();
            const googleSheets = google.sheets({ version: "v4", auth: client });
            const spreadsheetId = "1P-n9CSiuoyCx6BIc4SUAOnBaNCl8RIHUGvHOMuPMfyM";
            googleSheets.spreadsheets.values.append({
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

        return `${body.event}\n${JSON.stringify(order, null, 4)}`

    }


}
async function convertCurrency() {
    let res = await fetch("https://v6.exchangerate-api.com/v6/a30b11a7bdddf93ddd0c920a/latest/USD")
    let body = await res.json()
    let conv = await body.conversion_rates.RUB
    return conv

}
process.on('uncaughtException', function(exception) {

    if (exception.code == 503) {
        console.log("Discord is down")
    } else {
        console.log(exception);

    }

});

//app.use('/api/discord', require('./discordauth/discordAuth'));
// app.use((err, req, res, next) => {
//     switch (err.message) {
//         case 'NoCodeProvided':
//             return res.status(400).send({
//                 status: 'ERROR',
//                 error: err.message,
//             });
//         default:
//             return res.status(500).send({
//                 status: 'ERROR',
//                 error: err.message,
//             });
//     }
// });