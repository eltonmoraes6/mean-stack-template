const mongoose = require('mongoose');

const ctrl = {};

const url = process.env.MONGOLAB_URI;
ctrl.MY_CONNECTION = () => {
    mongoose.connect(url, {
        useCreateIndex: true,
        useNewUrlParser: true
    }).then(() => {
        console.log('Successfully connected to Database');
    }).catch((err) => {
        if (err) {
            console.log('Failed to cennect to Database on startup - retrying in 5 sec', err);
            setTimeout(ctrl.MY_CONNECTION, (5000));
        }
    });
};

module.exports = ctrl;