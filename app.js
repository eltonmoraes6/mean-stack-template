const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary');
const passport = require('passport');

//NODE Environment 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
    });
}

const db = require('./src/config/database');
const multerConfig = require('./src/config/multerConfig');

//Initialization
const app = express();
db.MY_CONNECTION();

//Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    limits: {
        files: 1,
        fileSize: 1024 * 1024
    },
    filename: multerConfig.filename,
    fileFilter: multerConfig.fileFilter,
});
require('./src/middleware/social_auth/social_passport')(app, passport);

app.use(multer({
    storage
}).single('avatar'));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Static Files
app.use('/uploads', express.static('public/uploads'));
app.use(express.static(__dirname + '/dist/src'));

//Routes
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/users', require('./src/routes/user'));
app.use('/api/task', require('./src/routes/task'));
app.use('/api/user/settings', require('./src/routes/userSettings'));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/src/index.html'));
});

module.exports = app;