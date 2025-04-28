

import nodemailer from 'nodemailer';

const sendTestEmail = async () => {
  // Create transporter with Gmail's SMTP service
  console.log(process.env.GMAIL_PASS);
  console.log(process.env.GMAIL_USER);
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Gmail service
    auth: {
      user: process.env.GMAIL_USER,  // Replace with your email
      pass: process.env.GMAIL_PASS,   
    },
  });
  

  // Define email options
  const mailOptions = {
    from: '"Test Sender" <your-email@gmail.com>', // sender address
    to: 'kripkish@gmail.com',  // Replace with the recipient's email
    subject: 'Harassment report',  // Subject of the email
    text: 'A report has been submitted near your Police station.',  // Plain text body
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Call the function to send the test email
sendTestEmail();
