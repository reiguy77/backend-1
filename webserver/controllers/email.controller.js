const nodemailer = require('nodemailer');


exports.send = (req, res) => {
    let to = req.body.to;
    let from = req.body.from;
    let subject = req.body.subject;
    let text = req.body.text;

    if (!to) {
        res.send({
            statusCode: 400,
            message: 'Recipient email address is missing.'
        });
        return;
    }

    // Create a transporter with the SMTP settings
    const transporter = nodemailer.createTransport({
    host: 'smtp.dreamhost.com', // Replace with your DreamHost SMTP server
    port: 465, 
    secure: true, // Set to true if you're using SSL/TLS
    auth: {
        user: 'contact@reillymclaren.com', // Your email address
        pass: 'CJodyhighroller_77' // Your email password
    }
    });

    // Define the email content
    const mailOptions = {
        from: from, // Your email address
        to: to, // Recipient's email address
        subject: subject,
        text: text
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        res.send({
            statusCode:400,
            message:error
        })
        console.error('Error sending email:', error);
    } else {
        res.send({
            statusCode:200,
            message:'Email sent successfully!'
        })
    }
    });


}