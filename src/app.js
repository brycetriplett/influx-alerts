require('module-alias/register');

const express = require('express');
const app = express();
app.use(express.json());

const postAlert = require('@root/controllers/postAlert');


// enables us to disable alerting for one hour, to be triggered by a slack command
let blockPost = false;
let blockPostTimeout = null;
let blockUntil = null;


app.use((req, res, next) => {
  if (blockPost && req.method === 'POST') {
    return res.status(403).json({ message: 'Posting is blocked temporarily.' });
  }

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


app.get('/block-posts', (req, res) => {
  blockPost = true;
  
  // Default to 60 minutes if no valid time is specified
  let blockTime = isNaN(req.query.time) ? 60 : parseInt(req.query.time, 10);
  blockTime = blockTime * 60 * 1000; // Convert minutes to milliseconds

  blockUntil = Date.now() + blockTime;

  blockPostTimeout = setTimeout(() => {
    blockPost = false;
    blockUntil = null;
    blockPostTimeout = null;
  }, blockTime);

  res.json({ message: `Posting is blocked for ${blockTime / 60 / 1000} minute(s).` });
});


app.get('/unblock-posts', (req, res) => {
  blockPost = false;
  blockUntil = null;
  
  if (blockPostTimeout) {
    clearTimeout(blockPostTimeout);
    blockPostTimeout = null;
  }
  
  res.json({ message: 'Posting is no longer blocked.' });
});


app.get('/time-left', (req, res) => {
  if (!blockPost) {
    res.json({ message: 'Posting is not currently blocked.' });
  } else {
    let timeLeft = Math.max((blockUntil - Date.now()) / 1000, 0);
    res.json({ message: `Posting is blocked for approximately ${Math.ceil(timeLeft / 60)} more minute(s).` });
  }
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