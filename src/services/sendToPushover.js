const axios = require('axios');


const sendToPushover = (message) => (
    axios.post('https://api.pushover.net/1/messages.json', {
        token: process.env.PUSHOVER_API_TOKEN,
        user: process.env.PUSHOVER_USER_KEY,
        message: message
    })
)

module.exports = sendToPushover;