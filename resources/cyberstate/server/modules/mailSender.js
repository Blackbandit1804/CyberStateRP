module.exports.Init = () => {
    alt.mailer = {};
    alt.mailer.sendMail = (to, subject, message) => {
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
            host: "mail.mh00p.net",
            port: 587,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'cyberstate_gs', // generated ethereal user
              pass: '4HmuhPgCm1qbF7vwk7XxEuVEtv421U3h' // generated ethereal password
            }
        });
        message += "<br /><br /> С Уважением, Команда Cyber State RP.";
        const mailOptions = {
            from: 'no-reply@cyberstaterp.ru',
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
