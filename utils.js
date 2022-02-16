
var request = require("request");

const sendRequest = (domain, endpoint, data) => {
    return new Promise((resolve, reject) => {
      var options = {
        method: "POST",
        url: `${domain}${endpoint}`,
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      };
  
      request(options, function (error, response, body) {
        if (error || body == undefined) return reject(error);
        try {
          body = JSON.parse(body);
          return resolve(body);
        } catch (error) {
          return reject(error)
        }
      });
    });
};

const getInfoFromMessage = (msg) => {
    let channel_id = msg.channel.id
    let channel_name = msg.channel.name
    let server_id = msg.guild.id
    let server_name = msg.guild.name
    let server_image = msg.guild.iconURL()
    return {channel_id, channel_name, server_id, server_name, server_image}
  }
  
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



module.exports = {
  sendRequest,
  getInfoFromMessage,
  sleep,
  capitalizeFirstLetter
}
