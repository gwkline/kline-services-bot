const fetch = require('node-fetch')
const fs = require('fs');
var es = require('event-stream');


let BOTS = {
    TRICKLE: 3,
    VALOR: 2,
    MEK: 1
}

let SKU = "ABCDEF"
let DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/${SKU}_SETUP`

async function isp() {

    let fileData = fs.readFileSync('C:/Users/gwkli/OneDrive/Desktop/shuffled.txt').toString().replace(/\r\n/g, '\n').split('\n');
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

async function main() {
    mkdirpath(DIRECTORY);

    for (i = 0; i < BOTS.TRICKLE; i++) {

        let isps = randomArrayShuffle(await isp())
        let smarts = await smart()
        let oxys = await oxy()
        let lemons = await lemon()
        let resis = randomArrayShuffle(lemons.concat(oxys, smarts))
        let total = isps.concat(resis)

        fs.writeFileSync(`${DIRECTORY}/trickle_${i}.txt`, total.join('\n'), (err) => {
            'pass'
        });

    }
    for (i = 0; i < BOTS.VALOR; i++) {

        let isps = randomArrayShuffle(await isp())
        let smarts = await smart()
        let oxys = await oxy()
        let lemons = await lemon()
        let resis = randomArrayShuffle(lemons.concat(oxys, smarts))
        let total = isps.concat(resis)

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

    let toggle = "2"
    let csvArr = []
    fs.createReadStream('C:/Users/gwkli/OneDrive/Desktop/test.csv')
        .pipe(es.split())
        .on('data', (r) => {
            csvArr.push(r);
            console.log(csvArr.length)

        })
        .on('end', () => {
            for (i = 0; i < csvArr.length; i++) {
                line = csvArr[i]
                lineArr = line.split(',')
                if (lineArr[2] == "FIRST NAME" || lineArr[4] == undefined) { console.log("HI") } else {
                    lineArr[0] = SKU
                    lineArr[1] = "random"
                    var count = Math.floor(800 / csvArr.length);
                    lineArr[16] = count
                    lineArr[17] = "5000"
                    lineArr[18] = "5000"
                    lineArr[19] = "YEEZY"
                    lineArr[20] = toggle
                    lineArr[21] = "abc"
                    lineArr[22] = "def"
                    line = lineArr.join(",")
                    console.log(line)
                    fs.appendFile(`${DIRECTORY}/test.csv`, line + "\n", (err) => {
                        if (err) console.error('Couldn\'t append the data');
                        console.log('The data was appended to file!');
                    });


                    if (toggle == "2") {
                        toggle = "3"
                    } else { toggle = "2" }
                }
            };

        })



}

main()