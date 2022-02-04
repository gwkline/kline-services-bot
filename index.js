const express = require("express");
const { google } = require("googleapis");
var request = require('request');
var JFile = require('jfile');
const fs = require('fs');

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let JFILE = new JFile("./log.txt");
let TOTAL_ORDERS = [] //JFILE.lines
let UPDATE_LOG = []
let WHITELIST = [
    "Fresh BestBuy Accounts",
    "Fresh SSense Accounts",
    "Fresh Walmart Accounts",
    "Fresh Target Account",
    "Fresh Outlook Combo Accounts",
    "Forwarded Outlook/Microsoft Accounts"
]

app.post("/", (req, res) => {
    res.send("Hi");
});

app.get("/", async(req, res) => {

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    await getOrders();
    await sleep(2000);
    await updateSpreadSheet();



    res.redirect("https://docs.google.com/spreadsheets/d/1P-n9CSiuoyCx6BIc4SUAOnBaNCl8RIHUGvHOMuPMfyM/edit#gid=0");

})

app.listen(1337, (req, res) => console.log("Running on port 1337"));


async function getOrders() {
    var options = {
        'method': 'GET',
        'url': 'https://shoppy.gg/api/v1/orders',
        'json': true,
        'headers': {
            'User-Agent': "test",
            'Authorization': 'RQepAUVv32dl6HqfpsR2CmTpLXdDgk2Rl139wcJuXS5hnAwGKU',
        }
    };

    await request(options, function(error, response) {
        if (error) throw new Error(error);

        let orders = response.toJSON()

        for (i in orders["body"]) {

            let timestamp = orders["body"][i]["paid_at"]
            let oid = orders["body"][i]["id"]
            let email = orders["body"][i]["email"]
            let product = orders["body"][i]["product"]["title"]
            let quantity = orders["body"][i]["quantity"]
            let custom_field = orders["body"][i]["custom_fields"]["value"]
            let price = (orders["body"][i]["quantity"] * orders["body"][i]["price"]) * 0.971 - 0.3

            //IF ALREADY LOGGED

            if (TOTAL_ORDERS.includes(oid)) {
                console.log("Skipping - Already Logged")
            }

            //IF UNPAID - IGNORE
            else if (timestamp == null) {
                //console.log("Skipping - Unpaid")
            } else if (!(WHITELIST.includes(product))) {
                //console.log("Skipping - Gavin's Account")
                TOTAL_ORDERS.push(oid)
            } else {
                let finOrder = {
                    "Timestamp": timestamp,
                    "Order_ID": oid,
                    "Email": email,
                    "Product": product,
                    "Quantity": quantity,
                    "Custom_Field": custom_field,
                    "Price": price

                }
                UPDATE_LOG.push(finOrder)
                TOTAL_ORDERS.push(oid)
                fs.writeFile('log.txt', oid + '\n', { flag: "a+" }, (err) => {
                    'pass'
                });
                //console.log("Logging - Success")

            }
        }
    });
}

async function updateSpreadSheet() {

    console.log("Updating Spreadsheet")

    if (UPDATE_LOG.length > 0) {

        // Create client instance for auth

        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        const client = await auth.getClient();

        // Instance of Google Sheets API
        const googleSheets = await google.sheets({ version: "v4", auth: client });

        const spreadsheetId = "1P-n9CSiuoyCx6BIc4SUAOnBaNCl8RIHUGvHOMuPMfyM";

        console.log("Beginning Logging Process")

        for (u in UPDATE_LOG) {
            console.log(`Logging: ${parseInt(u) + 1}`)

            await googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: "Sheet1!A:A",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [
                        [UPDATE_LOG[u].Timestamp, UPDATE_LOG[u].Order_ID, UPDATE_LOG[u].Email, UPDATE_LOG[u].Product, UPDATE_LOG[u].Custom_Field, UPDATE_LOG[u].Quantity, UPDATE_LOG[u].Price] //, quantity, note, price
                    ],
                },
            });
        }

        UPDATE_LOG = []
        return true

    } else {
        return false
    };
}