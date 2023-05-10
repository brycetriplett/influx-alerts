const { config } = require('dotenv');

const express = require('express');
const app = express();
app.use(express.json());

const Ajv = require('ajv');
const addFormats = require('ajv-formats')
const alertSchema = require('./alertSchema');
const ajv = new Ajv();
addFormats(ajv);
const validateAlert = ajv.compile(alertSchema);

const transformAlertData = require('./transformAlertData');
const sendToPushover = require('./sendToPushover');


app.post('/alerts', (req, res) => {
    const alertData = req.body;

    if (!validateAlert(alertData)) {
        return res.status(400).json({ message: 'Invalid alert data format.', errors: validateAlert.errors });
    }

    const transformedData = transformAlertData(alertData);

    // sendToPushover(transformedData)
    // .then(response => {
    //     res.status(200).json({
    //         message: 'Alert Forwarded'
    //     })
    // })
    // .catch(error => {
    //     res.status(500).json({
    //         message: 'Failed to forward message'
    //     })
    // })

    res.status(200).json({
        message: 'Alert Forwarded'
    })
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})