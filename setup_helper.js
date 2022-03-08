const fetch = require('node-fetch')
const fs = require('fs');
var es = require('event-stream');
const { time } = require('console');
const { exit } = require('process');


let BOTS = {
    TRICKLE: 4,
    VALOR: 2,
    MEK: 1,
    VELOX: 1
}

let SKU = ["HQ6448", "GW1931", "GW1934"]
let MODES = ["2aycd", "3aycd"]
let DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/${SKU}_SETUP`

async function isp() {

    let fileData = fs.readFileSync('C:/Users/gwkli/OneDrive/Desktop/Proxies/Slides.txt').toString().replace(/\r\n/g, '\n').split('\n');
    return fileData

}

async function lemon() {
    const response = await fetch("https://www.lemonproxy.net/api/ProxyGenerage/GenerateProxy", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "x-token": "IJaMUHlugR5sZX1i2VUR03oeM6zAvi",
            "Referer": "https://www.lemonproxy.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "[{\"Countries\":[\"us\"],\"Proxy1Num\":500,\"Proxy2Num\":500}]",
        "method": "POST"
    });

    const body = await response.json()
    var lemon = (body.result.toString()).split("\n");
    return lemon

}

async function oxy() {

    const response = await fetch("https://data.whop.com/api/v3/proxies/8152/generate", {
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
        "body": "{\"id\":8152,\"quantity\":\"1000\",\"country\":\"US\"}",
        "method": "POST"
    });


    const body = await response.json()
    var oxy = (body.data);
    return oxy

}

async function smart() {

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
        "body": "{\"id\":8235,\"quantity\":\"1000\",\"country\":\"US\"}",
        "method": "POST"
    });

    const body = await response.json()
    var smart = (body.data);
    return smart

}

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

    await mkdirpath(DIRECTORY);
    sleep(2000)

    let isps = randomArrayShuffle(await isp())
    let splits = BOTS.VALOR + BOTS.TRICKLE
    let splitLists = new Array(splits)
    splitLists = await partition(isps, splits)

    for (i = 0; i < BOTS.TRICKLE; i++) {

        oxys = await oxy()
        ispList = splitLists[i]
        lemons = await lemon()
        resis = randomArrayShuffle(lemons.concat(oxys))
        total = ispList.concat(resis)

        fs.writeFileSync(`${DIRECTORY}/trickle_${i}.txt`, total.join('\n'), (err) => {
            'pass'
        });

    }
    for (i = 0; i < BOTS.VALOR; i++) {

        oxys = await oxy()
        ispList = splitLists[i]
        lemons = await lemon()
        resis = randomArrayShuffle(lemons.concat(oxys))
        total = ispList.concat(resis)

        fs.writeFileSync(`${DIRECTORY}/valor_${i}.txt`, total.join('\n'), (err) => {
            'pass'
        });

    }
    for (i = 0; i < BOTS.MEK; i++) {

        let isps = randomArrayShuffle(await isp())

        fs.writeFileSync(`${DIRECTORY}/mek_${i}.txt`, isps.join('\n'), (err) => {
            'pass'
        });

    }
    for (i = 0; i < BOTS.VELOX; i++) {

        let isps = randomArrayShuffle(await isp())

        fs.writeFileSync(`${DIRECTORY}/velox_${i}.txt`, isps.join('\n'), (err) => {
            'pass'
        });

    }

    let toggle = 0;
    let csvArr = []
    fs.createReadStream('C:/Users/gwkli/OneDrive/Desktop/trickle.csv')
        .pipe(es.split())
        .on('data', (r) => {
            csvArr.push(r);

        })
        .on('end', () => {
            for (i = 0; i < csvArr.length; i++) {
                if (i == 0) {
                    fs.appendFile(`${DIRECTORY}/profiles.csv`, csvArr[i] + "\n", (err) => {
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

                            lineArr[16] = 1
                            lineArr[17] = "5000"
                            lineArr[18] = "5000"
                            lineArr[19] = "YEEZY"
                            lineArr[20] = MODES[(toggle % MODES.length)]
                            toggle++
                            lineArr[21] = "abc"
                            lineArr[22] = "def"
                            line = lineArr.join(",")
                            fs.appendFile(`${DIRECTORY}/profiles.csv`, line + "\n", (err) => {
                                if (err) console.error('Couldn\'t append the data');
                            });
                        }
                    }
                }
            };

        })



}

main()