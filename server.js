require("dotenv").config();
const express = require('express');
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const app = express();

app.use(express.json());

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));

app.post('/subscribe', async (req, res) => {
  if (!req.body.captcha)
    return res.json({ success: false, msg: 'Please select captcha' });

  // Secret key
  const secretKey = process.env.SECRET_KEY;

  // Verify URL
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // Make a request to verifyURL
  const body = await fetch(verifyURL).then(res => res.json());

  // If not successfull
  if (body.success !== undefined && !body.success)
    return res.json({ success: false, msg: 'Failed captcha verification' });

  // If successfull
  return res.json({ success: true, msg: 'Captcha passed' });
});

app.listen(3000, () => console.log('Server started on port 3000'));