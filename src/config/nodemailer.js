const nodemailer = require('nodemailer');

const ctrl = {};

ctrl.transporter = nodemailer.createTransport({
    service: process.env.HOST_SERVICE,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})

module.exports = ctrl;