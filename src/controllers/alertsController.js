const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const alertSchema = require('@root/utils/alertSchema');
const ajv = new Ajv();
addFormats(ajv);
const validateAlert = ajv.compile(alertSchema);

const transformAlertData = require('@root/utils/transformAlertData');
const sendToPushover = require('@root/services/sendToPushover');

const postAlert = async (req, res, next) => {
    try {
      const alertData = req.body;
  
      if (!validateAlert(alertData)) {
        return next(new Error('Invalid alert data format.'));
      }
  
      const transformedData = transformAlertData(alertData);
  
      await sendToPushover(transformedData);
  
      res.status(200).json({
        message: 'Alert Forwarded'
      });
    } catch (error) {
      next(new Error('Failed to forward message'));
    }
  };

module.exports = {
    postAlert
};