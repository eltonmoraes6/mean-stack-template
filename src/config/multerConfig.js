const ctrl = {};

ctrl.filename = (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
};

ctrl.fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = ctrl;