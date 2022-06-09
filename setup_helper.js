const fetch = require('node-fetch')
const fs = require('fs');
var es = require('event-stream');
const { time } = require('console');
const { exit } = require('process');
const collect = require('collect.js');



let BOTS = {
    TRICKLE: 4,
    VALOR: 0,
    MEK: 0,
    VELOX: 0,
}

let TOTAL = BOTS.TRICKLE + BOTS.VALOR + BOTS.MEK + BOTS.VELOX

let PROXY = {
    QUANTITY: 3000 * TOTAL,
    LEMON: true,
    OXY: true,
    SMART: false,
    PROXDROP: false,
    ISP: false,
}


let SKU = ["HP8739"]
let MODES1 = ["2", "3"]
let MODES = ["2aycd", "3aycd"]
let SIZING = "random"
let TRICKLE_ON = true

let EXPORT_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/${SKU}_SETUP`
let ISP_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/Proxies/dropday.txt`
let PD_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/Proxies/proxydrop.txt`
let TRICKLE_DIRECTORY = `C:/Users/gwkli/OneDrive/Desktop/trickle.csv`

let TASK_LIMIT = 1300
let TASK_QUANTITY_TRICKLE = 9




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
    if (TRICKLE_ON) {


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
                                    //lineArr[1] = SIZING
                                lineArr[16] = TASK_QUANTITY_TRICKLE //Quantity
                                lineArr[17] = "5000"
                                lineArr[18] = "5000"
                                lineArr[19] = "YEEZY"
                                lineArr[20] = MODES0[(toggle % MODES0.length)]
                                toggle++
                                lineArr[21] = "abc"
                                lineArr[22] = "def"
                                line1 = lineArr.join(",")
                                lineArr[20] = MODES[(toggle % MODES.length)]
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

    const response = await fetch("https://legacy.whop.com/proxies/generate_proxies", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "amp_fef1e8=90d6552f-2ddc-4e77-89f2-33bfa0330ab8R...1fqond698.1fqond898.2.0.2; __stripe_mid=7de0692b-8eee-4a58-a50f-887ab7bea52bf2375c; intercom-id-llm7ll78=e7f90150-8e8f-4f00-8721-f5d928f097d1; amp_3ccada=_9XNfahNPaj6y6eb3k2lCM.Mjc3NTU=..1g06089h4.1g0608d1g.4.0.4; __stripe_mid=7de0692b-8eee-4a58-a50f-887ab7bea52bf2375c; __stripe_sid=0a79c878-6a62-4b1b-993e-38a8042e6ffff36dcd; user_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ik1qYzNOVFU9IiwiZXhwIjoiMjAyNy0wNC0wOVQwMTo1MTowNC4wMjNaIiwicHVyIjpudWxsfX0%3D--3f6397775dc025b54cb682b336df0fb901bf2c0b; _rental_platform_session=iIQvhEzqlASMwVijiQMub%2Fr3%2B51rmioxA%2B8p6ovhEVvfYrq%2BD0y4kPuXKbN0UvzztBw1HOukCJDyt7mDQ7ClBucYnbUUEdZZBRiG5eP7E7Qa%2Be8%2Bx1Qbwyt8MSoqmeGj9hzPsSBxlhbyqRAmZdf6kxncQSDOAHQBx6XnNQ9i--CpNN21wBxYPxCpf9--BagoA4wEX2DUJ4nQmMLg7Q%3D%3D; intercom-session-llm7ll78=N0xGSkFmMEFiallrNmRqc2lYMDdITlJ1bzNKZGxFTW1LUktOZng4ZG1JWElIOW13RUtRWTZrWkIrM1hoOE10Ry0tZ3ZSQVJwckdkSDJmQUprOEhRRXJFUT09--c9f1e05ce31df17a94d6ae8a7e97ae95752049c3",
            "Referer": "https://legacy.whop.com/proxies/dashboard",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `authenticity_token=z4QNUgTOAq1IW79AIO64O5KZCRbHPqwrgVIRKwmGOjrSkXlalP2OH0ocn3BAg9EHc%2Fv33KDYPJWea9n6ARiZ9g%3D%3D&proxy_order_id=8152&number_of_proxies=${quantity}&country=us&proxy_type=2`,
        "method": "POST"
    });
    //console.log(await response.text())
    const body = await response.text()

    var oxy = await body.toString().split("\n")
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