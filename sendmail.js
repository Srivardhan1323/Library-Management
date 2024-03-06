const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'srivardhan984@gmail.com',
    pass: 'afljnfxjuehuatxt',
  },
});

// Compose email options
const mailOptions = {
  from: 'SrivardhanMaddi',
  to: '21je0517@iitism.ac.in',
  subject: 'Regarding Book Return',
  text: 'The dead-line to return your book is tommorow otherwise you have to pay fine.So make sure to return your book as soon as possible.'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
