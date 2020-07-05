module.exports.Init = () => {
    alt.mailer = {};
    alt.mailer.sendMail = (to, subject, message) => {
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
            host: "mail.example.com",
            port: 587, //SMTP Port
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'username', // generated ethereal user
              pass: 'password' // generated ethereal password
            }
        });
        message += "<br /><br /> Regards, The Cyber ​​State RP Team.";
        const mailOptions = {
            from: 'no-reply@example.com',
            to: to,
            subject: subject,
            html: message
        };
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) alt.log(err)
            else alt.log(info);
        });
    }
}
