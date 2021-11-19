const nodemailer = require('nodemailer');


const sendEmail = async (options) => {

    //steps
    // 1) Create a Transporter Object
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      //   secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    console.log(`HOST ${process.env.EMAIL_HOST}`);
 

    // 2) Set email options
    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: options.email,
      subject: options.subject,
      text: `Hello ${options.email}`,
      html: options.body,
    };
 
    // 3) Send Email

   await transporter.sendMail(emailOptions)
}

module.exports = sendEmail