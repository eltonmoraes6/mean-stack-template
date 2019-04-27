const titleCase = require('title-case');
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Task = require('../models/task');
const validation = require('../validation/validate-input');
const confNodemailer = require('../config/nodemailer');

const ctrl = {};

// Get single user ById-> api/user/settings/:id -> GET
//authenticated: true
ctrl.get_user_by_id = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const user = await User.findById({
                _id: id
            })
            .select('name email avatar role active _id');
        if (user) {
            res.status(200).json({
                success: true,
                user: user,
                request: {
                    type: 'GET',
                    url: process.env.WEB_API_URL + 'user/' + user._id
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'User not found'
        });
    };
};


// Remove single user ById-> api/user/settings/delete/:id -> DELETE
//authenticated: true
ctrl.remove_user_account = async (req, res) => {

    try {
        const {
            id
        } = req.params;
        const user = await User.findOne({
            _id: id
        });

        if (user) {
            const task = await Task.find({
                user: user._id
            }).select('user avatar_public_id');

            if (user.avatar_public_id) {
                await cloudinary.v2.uploader.destroy(user.avatar_public_id);
            }

            if (task) {
                await task.forEach(async (doc) => {
                    await cloudinary.v2.uploader.destroy(doc.avatar_public_id);
                    doc.remove();
                });
            }
            await User.deleteOne({
                _id: id
            });

            res.json({
                success: true,
                message: 'User account removed successfuly'
            });

        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'User not found'
        });
    };

};

// Update user -> api/user/settings/update/:id -> PATCH
//authenticated: true
ctrl.update_user = async (req, res) => {

    const {
        errors,
        isValid
    } = validation.validateUserSwttingsNameInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {
        const id = req.params.id;

        const {
            name,
        } = req.body;

        const updateUser = ({
            name: titleCase(name),
        });

        const result = await User.updateOne({
            _id: id
        }, {
            $set: updateUser,
        });

        if (result) {
            res.status(200).json({
                message: 'User updated successfully',
                success: true,
                request: {
                    type: 'GET',
                    url: process.env.WEB_API_URL + 'users/'
                }
            });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'User not found'
        });
    };
};


ctrl.resetPassword = async (req, res) => {
    const {
        errors,
        isValid
    } = validation.validateResetPasswordInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {
        const {
            oldPassword,
            newPassword,
        } = req.body;
        const decoded = req.decoded;

        if (oldPassword === undefined || oldPassword === '') {
            errors.requiredOldPassword = 'Field Old Password is Required'
            return res.status(400).json(errors);
        }
        const user = await User.findOne({
            email: decoded.email
        });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (isMatch) {
            const mailOptions = {
                from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                to: user.email,
                subject: 'Account Activation',
                text: 'Hello ' + user.name + ', Your password has been successfully changed!',
                html: '<h1>Helo</h1><strong>' + user.name + '</strong> <br><br> Your password has been successfully changed!'
            };
            confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    bcrypt.genSalt(10, async (err, salt) => {
                        bcrypt.hash(newPassword, salt, async (err, hash) => {
                            if (err) throw err;
                            const result = await User.updateOne({
                                email: decoded.email
                            }, {
                                $set: {
                                    password: hash,
                                    password_verified: true,
                                    resetPasswordToken: false,
                                    temporaryToken: false
                                }
                            });
                            if (result) {
                                res.json({
                                    success: true,
                                    message: 'Password updated successfully!'
                                })
                            }
                        });

                    });
                    console.log('Email sent: ' + info.response);
                };
            });
        } else {
            errors.notFound = 'Old Password incorrect'
            return res.status(400).json(errors);
        };
    } catch (err) {
        console.log(err);
        res.status(404).json({
            success: true,
            message: 'Something went wrong'
        });
    };
};

module.exports = ctrl;