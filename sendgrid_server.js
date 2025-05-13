
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

sgMail.setApiKey(SENDGRID_API_KEY);

app.post('/send-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).send({ error: 'Email and code are required.' });
  }

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: 'رمز التحقق من Newcore',
    text: `رمز التحقق الخاص بك هو: ${code}`,
    html: `<p>رمز التحقق الخاص بك هو:</p><h2>${code}</h2>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send({ message: 'Code sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to send code.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
