require('module-alias/register');

const express = require('express');
const app = express();
app.use(express.json());

const { postAlert } = require('@root/controllers/alertsController');


// enables us to disable alerting for one hour, to be triggered by a slack command
let blockPost = false;
let blockPostTimeout = null;


app.use((req, res, next) => {
  if (blockPost && req.method === 'POST') {
    return res.status(403).json({ message: 'Posting is blocked temporarily.' });
  }

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


app.get('/block-posts', (req, res) => {
  blockPost = true;
  blockPostTimeout = setTimeout(() => {
    blockPost = false;
    blockPostTimeout = null;
  }, 60 * 60 * 1000); // Unblock posts after 1 hour

  res.json({ message: 'Posting is blocked for 1 hour.' });
});


app.get('/unblock-posts', (req, res) => {
  blockPost = false;
  if (blockPostTimeout) {
    clearTimeout(blockPostTimeout);
    blockPostTimeout = null;
  }
  
  res.json({ message: 'Posting is no longer blocked.' });
});


app.post('/alerts', (req, res, next) => {
  if (blockPost) {
    return res.status(403).json({ message: 'Posting is blocked temporarily.' });
  }

  postAlert(req, res, next);
});


app.use((err, req, res, next) => {
  console.log(err);
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