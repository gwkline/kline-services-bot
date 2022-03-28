const fetch = require('node-fetch')
const fs = require('fs');
var es = require('event-stream');
const { time } = require('console');
const { exit } = require('process');
const collect = require('collect.js');



let BOTS = {
    TRICKLE: 2,
    VALOR: 2,
    MEK: 0,
    VELOX: 0,
}
let TOTAL = BOTS.TRICKLE + BOTS.VALOR + BOTS.MEK + BOTS.VELOX

let PROXY = {
    QUANTITY: 2000 * TOTAL,
    LEMON: true,
    OXY: false,
    SMART: false,
    PROXDROP: false
}


let SKU = ["GY1759"]
let MODES1 = ["2", "3"]
let MODES0 = ["2aycd", "3aycd"]
let SIZING = "random"

let EXPORT_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/${SKU}_SETUP`
let ISP_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/Proxies/dropday.txt`
let PD_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/Proxies/proxydrop.txt`
let TRICKLE_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/trickle.csv`

let TASK_LIMIT = 1300
let TASK_QUANTITY_TRICKLE = 5




function randomArrayShuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function mkdirpath(dirPath) {
    try {
        fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
        try {
            fs.mkdirSync(dirPath);
        } catch (e) {
            mkdirpath(path.dirname(dirPath));
            mkdirpath(dirPath);
        }
    }
}

const partition = (x, n) => {
    const p = x.length % n,
        q = Math.ceil(x.length / n),
        r = Math.floor(x.length / n);
    return [...Array(n)].reduce((a, _, i) => (a[0].push(x.slice(a[1], (a[1] += i < p ? q : r))), a), [
        [], 0
    ])[0];
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {


    await mkdirpath(EXPORT_DIRECTORY);
    sleep(2000)

    await getProxies(PROXY.QUANTITY)

    let toggle = 0;
    let csvArr = []
    fs.createReadStream(TRICKLE_DIRECTORY)
        .pipe(es.split())
        .on('data', (r) => {
            csvArr.push(r);
        })
        .on('end', () => {
            for (i = 0; i < csvArr.length; i++) {
                if (i == 0) {
                    fs.appendFile(`${EXPORT_DIRECTORY}/profiles_in.csv`, csvArr[i] + "\n", (err) => {
                        if (err) console.error('Couldn\'t append the data');
                    });
                    fs.appendFile(`${EXPORT_DIRECTORY}/profiles_aycd.csv`, csvArr[i] + "\n", (err) => {
                        if (err) console.error('Couldn\'t append the data');
                    });
                    sleep(2000)

                } else {
                    line = csvArr[i]
                    lineArr = line.split(',')
                    var count = Math.floor(800 / (csvArr.length * SKU.length))

                    if (lineArr[2] == "FIRST NAME" || lineArr[4] == undefined) { console.log("") } else {
                        for (sku in SKU) {
                            lineArr[0] = SKU[sku]
                            lineArr[1] = SIZING
                            lineArr[16] = TASK_QUANTITY_TRICKLE //Quantity
                            lineArr[17] = "5000"
                            lineArr[18] = "5000"
                            lineArr[19] = "YEEZY"
                            lineArr[20] = MODES0[(toggle % MODES0.length)]
                            toggle++
                            lineArr[21] = "abc"
                            lineArr[22] = "def"
                            line1 = lineArr.join(",")
                            lineArr[20] = MODES1[(toggle % MODES1.length)]
                            line2 = lineArr.join(",")


                            fs.appendFile(`${EXPORT_DIRECTORY}/profiles_in.csv`, line2 + "\n", (err) => {
                                if (err) console.error('Couldn\'t append the data');
                            });


                            fs.appendFile(`${EXPORT_DIRECTORY}/profiles_aycd.csv`, line1 + "\n", (err) => {
                                if (err) console.error('Couldn\'t append the data');
                            });
                        }
                    }
                }
            };

        })




}

async function getProxies(quantity) {

    let isps = randomArrayShuffle(await isp())
    let resis = []

    if (PROXY.OXY) {

        resis = resis.concat(await oxy(quantity))
    }

    if (PROXY.LEMON) {
        resis = resis.concat(await lemon(quantity))
    }
    if (PROXY.PROXDROP) {
        resis = resis.concat(await pd(quantity))
    }
    if (PROXY.SMART) {
        resis = resis.concat(await smart(quantity))
    }

    resis = randomArrayShuffle(resis)
    console.log(resis.length)


    let splitISP = new Array(TOTAL)
    splitISP = await partition(isps, TOTAL)

    let splitResi = new Array(TOTAL)
    splitResi = await partition(resis, TOTAL)

    for (i = 0; i < TOTAL; i++) {
        ispList = splitISP[i]
        total = ispList.concat(splitResi[i])
        fs.writeFileSync(`${EXPORT_DIRECTORY}/mixed_${i}.txt`, total.join('\n'), (err) => {
            'pass'
        });
    }
}

async function getProxiesOld(old) {

    for (i = 0; i < BOTS.TRICKLE; i++) {

        ispList = splitISP[i]
        oxys = await oxy(1000)
        lemons = await lemon(1000)
        resis = randomArrayShuffle(lemons.concat(oxys))
        total = ispList.concat(resis)

        fs.writeFileSync(`${EXPORT_DIRECTORY}/trickle_${i}.txt`, total.join('\n'), (err) => {
            'pass'
        });

    }
    for (i = 0; i < BOTS.VALOR; i++) {

        ispList = splitISP[i]
        oxys = await oxy(1000)
        lemons = await lemon(1000)
        resis = randomArrayShuffle(lemons.concat(oxys))
        total = ispList.concat(resis)

        fs.writeFileSync(`${EXPORT_DIRECTORY}/valor_${i}.txt`, total.join('\n'), (err) => {
            'pass'
        });

    }
    for (i = 0; i < BOTS.MEK; i++) {

        let isps = randomArrayShuffle(await isp())
        fs.writeFileSync(`${EXPORT_DIRECTORY}/mek_${i}.txt`, isps.join('\n'), (err) => {
            'pass'
        });

    }
    for (i = 0; i < BOTS.VELOX; i++) {

        let isps = randomArrayShuffle(await isp())
        fs.writeFileSync(`${EXPORT_DIRECTORY}/velox_${i}.txt`, isps.join('\n'), (err) => {
            'pass'
        });

    }
}

async function isp() {

    let fileData = fs.readFileSync(ISP_DIRECTORY).toString().replace(/\r\n/g, '\n').split('\n');
    return fileData

}

async function lemon(quantity) {
    const response = await fetch("https://www.lemonproxy.net/api/ProxyGenerage/GenerateProxy", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "x-token": "xOhe1iMTWDkp97oLQn0JJDePKiIe1s",
            "Referer": "https://www.lemonproxy.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `[{\"Countries\":[\"us\"],\"Proxy1Num\":${quantity / 2},\"Proxy2Num\":${quantity / 2}}]`,
        "method": "POST"
    });

    if (response == "undefined") {
        return Error("Renew Lemon API key")

    }
    const body = await response.json()

    var lemon = await (body.result.toString()).split("\n");
    return lemon

}

async function oxy(quantity) {

    const response = await fetch(`https://product-service-w34nvoxnwq-uc.a.run.app/api/v1/data/generate/elite/${quantity}/Yeezysupply/STICKY`, {
        "headers": {
            "authorization": "JWT eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNjb3JkX2lkIjoiMzYxOTEwODQ0MTQzMTczNjMyIiwidGVuZXRfdG9rZW4iOiJIUHBmNThvOThFVGZvVEwxM3g5S1FTcFlXMXYyIiwiaWF0IjoxNjQ3OTI0MjE3LCJleHAiOjE2NDc5MzUwMTcsImF1ZCI6IjM2MTkxMDg0NDE0MzE3MzYzMiIsImlzcyI6ImF1dGhfc2VydmljZSJ9.iaBckuFgKd4TxskFxlOHw4YmBxyTUD4j0zdpdTDthGEBmoY-N9d9BZeCjOlxjfM0XyRxT4_aCHuecRUMz-A2c_T_i0oA1YXol592PcMJ7OMdQzLfnvxhar6UCQSkFEw-On4OPU2WJ_AXOeLnRke9qkBEXEhdUMECxoC3-wN-ORJ3vJ5Q7UD4jPLN3WmmvFcxr8I_kUeRNovaY4tJ9LuRf998NQsAbR7aVeSif08ySXwTwxOdmjkjf5yYBcdoero9yhqwiccYkiBJWYfSOpwa3BdhfgfYpQKhUJktHtSCHXooGZ6ESz5YnLmyCBPiEYsSuU7PwtlJSIbNV7vUkHkYMwSzuB2fMEzkgrCzVMYmDfta5r3kJnc26VOSePpnEIF7-BjI_8TRjrGydW5mp5CAGjzmuQGiOT3AxVwk5PnmtJZVCcu3X_uwlaMjucShwcSfs0XDO7H5ehgvXVkbUw11b6l4z0OrGGGKOdLYngPUlJ3O03_yEYp3Cvqj1K__loXFejJuEVET6Ctan1o3SuANCUqG3gxQxNLE6nGKm8l8jEpJL6fBiX12Z9W1HLQAZRKmfXXeksqvu4LBmZcUeieuQi-e4MpOW3gLIU2ud3FWseDuycQIgSWbRk5rb8HJXWH6M43eqpISRucY2KFR0G6Nt7J-KYzk9R3E_zKcAw_wlqM",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "Referer": "https://maliceproxies.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });
    const body = await response.json()

    var oxy = await body.list.toString().split("\n")
    for (i in oxy) {
        oxy[i] = oxy[i].replace(',', "")
    }
    return oxy

}

async function smart(quantity) {

    const response = await fetch("https://data.whop.com/api/v3/proxies/8235/generate", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "anton": "21398422370",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNzc1NX0.WUYiL7m5B6AxYQ4CayVUo9NCrmMv8pYLy-XPWAEYdnw",
            "content-type": "application/json",
            "r": "1646032490",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "Referer": "https://whop.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"id\":8235,\"quantity\":\"${quantity}\",\"country\":\"US\"}`,
        "method": "POST"
    });

    const body = await response.json()
    var smart = (body.data);
    return smart

}

async function pd(quantity) {

    let fileData = fs.readFileSync(PD_DIRECTORY).toString().replace(/\r\n/g, '\n').split('\n');
    return fileData

}

main()