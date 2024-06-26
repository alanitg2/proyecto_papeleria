require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 

const app = express();
const port = process.env.PORT || 3000;

const secret = process.env.JWT_SECRET;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', (req, res) => {
  const { to, subject, text, attachments } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: attachments ? attachments.map(file => ({
      filename: file.filename,
      path: file.path,
    })) : [],
  };

  console.log('Mail Options:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: error.toString() });
    }
    console.log('Email sent:', info.response);
    res.json({ message: 'Email sent', response: info.response });
  });
});

app.post('/register-email', (req, res) => {
  const { correo } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: 'Registro exitoso',
    text: 'Te has registrado exitosamente en nuestro sistema.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error al enviar el correo de confirmación.' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Correo de confirmación enviado.' });
  });
});

app.post('/generate-token', (req, res) => {
  const { userId, role } = req.body;
  const token = jwt.sign({
    'https://hasura.io/jwt/claims': {
      'x-hasura-user-id': userId,
      'x-hasura-default-role': role || 'user',
      'x-hasura-allowed-roles': [role || 'user']
    }
  }, secret, { expiresIn: '1h' });

  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
