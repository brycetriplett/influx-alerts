const transformAlertData = (data) => {
    let alertString = `ALERT\n` +
        `${data._check_name} has reached level: ${data._level}\n` +
        `message: ${data._message}\n`;
  
    for (let key in data) {
      if (!key.startsWith('_')) {
        alertString += `${key}: ${data[key]}\n`;
      }
    }
  
    return alertString;
  };

module.exports = transformAlertData;