require('module-alias/register');

const { config } = require('dotenv');

const express = require('express');
const app = express();
app.use(express.json());

const alertsController = require('@root/controllers/alertsController');

app.post('/alerts', alertsController.postAlert);

app.use((err, req, res, next) => {
  if (err.message === 'Invalid alert data format.') {
    return res.status(400).json({ message: err.message, errors: validateAlert.errors });
  }

  if (err.message === 'Failed to forward message') {
    return res.status(500).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal server error.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});