const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const fs = require("fs");
const titleCase = require('title-case');
const cloudinary = require('cloudinary');

const User = require('../models/user');
const validation = require('../validation/validate-input');
const confNodemailer = require('../config/nodemailer');

const ctrl = {};

// User register -> api/users/signup -> POST
//authenticated: false
ctrl.user_signup = async (req, res) => {

    const {
        errors,
        isValid
    } = validation.validateSignupInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {
        const {
            name,
            email,
            password,
        } = req.body;

        const user = await User.findOne({
            email
        });

        if (user) {
            errors.email = 'Email already exists'
            return res.status(400).json(errors);
        } else {

            const avatar = gravatar.url(email, {
                s: '200', //Size
                r: 'pg', // Rating
                d: 'mm', //Default img

            }, true);

            const newUser = new User({
                name: titleCase(name),
                email,
                avatar,
                password,
            });

            const payload = {
                name,
                email,
            };

            newUser.temporaryToken = await jwt.sign(payload, process.env.SECRET, {
                expiresIn: 60 * 60
            });
            //Token sent to user by nodemailer
            console.log(newUser.temporaryToken);

            const mailOptions = {
                from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                to: email,
                subject: 'Account Activation',
                text: 'Hello ' + name + ', thak you for registering at localhost.com. Please click on the following link to complete your activation:' + process.env.DOMAIN_NAME + 'activation/' + newUser.temporaryToken,
                html: '<h1>Helo</h1><strong>' + name + '</strong> <br><br> thak you for registering at localhost.com. Please click on the following link to complete your activation: <br><br> <a href="' + process.env.DOMAIN_NAME + 'activation/' + newUser.temporaryToken + '">' + process.env.DOMAIN_NAME + 'activation/</a>'
            };

            confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    bcrypt.genSalt(10, async (err, salt) => {
                        bcrypt.hash(newUser.password, salt, async (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            const user = await newUser.save();
                            res.status(201).json({
                                user: user,
                                success: true,
                                message: 'Account registered! Please check your e-mail for activation link.',
                            });
                        });
                    });
                    console.log('Email sent: ' + info.response);
                };
            });
        };

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    };

};

// User login -> api/users/signin -> POST
//authenticated: false
ctrl.user_signin = async (req, res) => {

    const {
        errors,
        isValid
    } = validation.validateSigninInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {

        const {
            email,
            password,
        } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        } else {
            const isActivated = user.active;
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (isActivated) {
                    const payload = {
                        email: user.email,
                        id: user._id,
                        role: user.role,
                    };
                    await jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 60 * 60
                    }, (err, token) => {
                        res.json({
                            data: {
                                name: user.name,
                                email: user.email,
                                request: {
                                    type: 'GET',
                                    url: process.env.WEB_API_URL + 'users/' + user.id
                                }
                            },
                            message: 'User authenticated!',
                            auth: true,
                            token: token
                        });
                    });
                } else {
                    errors.active = 'Account is not activated yet. Please check your e-mail for activation link.';
                    return res.status(400).json(errors);
                    /*res.status(400).json({
                        active: false,
                        message: 'Account is not activated yet. Please check your e-mail for activation link.'
                    });*/
                };

            } else {
                errors.password = 'Password incorrect';
                return res.status(400).json(errors);
            };
        };

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err
        });
    };
};

// get current user profile -> api/users/me/ -> POST
//authenticated: true 
ctrl.user_profile = async (req, res) => {
    try {

        const decoded = req.decoded;
        const profile = await User.findOne({
            email: decoded.email
        }).select('name email avatar google_picture facebook_picture role active temporaryToken resetPasswordToken password_verified _id');

        if (profile) {
            res.status(200).json({
                auth: true,
                decoded: profile,
                request: {
                    type: 'GET',
                    url: process.env.WEB_API_URL + 'users/',
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            });
        };
    } catch (err) {

        console.log(err);
        res.status(404).json({
            message: err
        });
    };

};

// Update user profile avatar -> api/users/update/avatar -> PATCH
//authenticated: true 
ctrl.update_user_avatar = async (req, res) => {
    try {
        if (req.file) {

            const newAvatar = req.file.path;
            const email = req.decoded.email;

            const removeFile = await User.findOne({
                email: email
            });

            const imgCloud = await cloudinary.v2.uploader.upload(newAvatar);

            if (removeFile.avatar) {

                const result = await User.updateOne({
                    email: email
                }, {
                    $set: {
                        avatar: imgCloud.url,
                        avatar_public_id: imgCloud.public_id
                    }
                });


                if (result) {
                    await fs.unlink(newAvatar, async (err) => {
                        if (err) {
                            throw err;
                        } else {
                            await cloudinary.v2.uploader.destroy(removeFile.avatar_public_id);
                            console.log('File unlinked');
                        };
                    });
                    res.status(200).json({
                        message: 'User Avatar updated',
                        success: true,
                        request: {
                            type: 'GET',
                            url: process.env.WEB_API_URL + result._id,
                        }
                    });
                }
            } else {
                res.status(404).json({
                    message: 'No Image provided'
                });
            };
        } else {
            res.status(404).json({
                message: 'No Image provided'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'No image provided'
        });
    };

};

// User account activation -> api/users/activation/:token -> PATCH
//authenticated: false 
ctrl.activationToken = async (req, res) => {

    try {

        const temporaryToken = req.params.token;

        const result = await User.findOne({
            temporaryToken: temporaryToken
        });

        //console.log(result);
        if (result) {
            const token = result.temporaryToken;
            //console.log(token);
            await jwt.verify(token, process.env.SECRET, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Activation link has expired'
                    });
                } else if (!result) {
                    res.json({
                        success: false,
                        message: 'Activation link has expired'
                    });
                } else {

                    const activated = await User.updateOne({
                        temporaryToken: token
                    }, {
                        $set: {
                            temporaryToken: false,
                            active: true,
                        }
                    });

                    if (activated) {

                        const mailOptions = {
                            from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                            to: result.email,
                            subject: 'Account Activation',
                            text: 'Hello ' + result.name + ', Your account has been successfully activated!',
                            html: '<h1>Helo</h1><strong>' + result.name + '</strong>, <br><br> Your account has been successfully activated!'
                        };

                        confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                            if (error) {
                                console.log(error);
                            } else {
                                res.json({
                                    success: true,
                                    message: 'Account activated!'
                                });
                                console.log('Email sent: ' + info.response);
                            };
                        });
                    };
                };
            });
        } else {
            res.json({
                success: false,
                message: 'Activation link has expired'
            });
        };

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Activation link has expired'
        });
    };
};

// User account resend token to activate account-> api/users/resend/ -> POST
//authenticated: false 
ctrl.resendToken = async (req, res) => {

    const {
        errors,
        isValid
    } = validation.validateResendInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {
        const {
            email,
        } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        } else {
            if (user.active) {
                errors.email = 'insert a valide e-mail';
                return res.status(404).json(errors);
            } else {

                const payload = {
                    email
                };

                newToken = await jwt.sign(payload, process.env.SECRET, {
                    expiresIn: 60 * 60
                });

                const mailOptions = {
                    from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                    to: email,
                    subject: 'Account Activation - New Link',
                    text: 'Hello ' + user.name + ', thak you for registering at localhost.com. Please click on the following link to complete your activation: ' + process.env.DOMAIN_NAME + 'activation/' + newToken,
                    html: '<h1>Helo</h1><strong>' + user.name + '</strong> <br><br> thak you for registering at localhost.com. Please click on the following link to complete your activation: <br><br> <a href="' + process.env.DOMAIN_NAME + newToken + '">' + process.env.DOMAIN_NAME + 'activation/</a>'
                };

                confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {

                        await User.updateOne({
                            email: email
                        }, {
                            $set: {
                                temporaryToken: newToken,
                            }
                        });

                        res.status(201).json({
                            success: true,
                            message: 'New link sent! Please check your e-mail for the new activation link.',
                        });
                        console.log('Email sent: ' + info.response);
                    };
                });
            };
        };
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    };
};

// User user renew session-> api/users/newtoken/:email -> GET
//authenticated: true 
ctrl.renewToken = async (req, res) => {

    try {

        const {
            email
        } = req.params;

        const user = await User.findOne({
            email: email
        });
        if (user) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            };
            await jwt.sign(payload, process.env.SECRET, {
                expiresIn: 60 * 60
            }, (err, token) => {
                res.json({
                    data: {
                        name: user.name,
                        email: user.email,
                        request: {
                            type: 'GET',
                            url: process.env.WEB_API_URL + 'users/' + user.id
                        }
                    },
                    message: 'User authenticated!',
                    auth: true,
                    token: token
                });
            });
        } else {
            errors.active = 'User not found';
            return res.status(404).json(errors);
        };

    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    };
};

// User require reset password link -> api/users/resetpassword/ -> POST
//authenticated: false 
ctrl.resetPassword = async (req, res) => {

    const {
        errors,
        isValid
    } = validation.validateResendInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {

        const {
            email
        } = req.body;

        const user = await User.findOne({
            email: email
        });

        if (user) {

            if (!user.active) {
                //resetPasswordToken
                errors.activated = 'User is not activated yet, please active your account first';
                return res.status(404).json(errors);
            } else {

                const payload = {
                    email: user.email,
                    id: user._id,
                    role: user.role,
                };
                const newResetPasswordToken = await jwt.sign(payload, process.env.SECRET, {
                    expiresIn: 60 * 60
                });

                if (newResetPasswordToken) {

                    //send email with the roken to restet the password
                    const mailOptions = {
                        from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                        to: user.email,
                        subject: 'Account Activation',
                        text: 'Hello ' + user.name + ', please click on the following link to proceed with the reset password: ' + process.env.DOMAIN_NAME + 'resetpassword/' + newResetPasswordToken,
                        html: '<h1>Helo</h1><strong>' + user.name + '</strong> <br><br> please click on the following link to proceed with the reset password: <br><br> <a href="' + process.env.DOMAIN_NAME + 'resetpassword/' + newResetPasswordToken + '">' + process.env.DOMAIN_NAME + 'forgotPassword/</a>'
                    };

                    confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {

                            const result = await User.updateOne({
                                email: user.email
                            }, {
                                $set: {
                                    resetPasswordToken: newResetPasswordToken,
                                }
                            });

                            res.json({
                                success: true,
                                result,
                                newResetPasswordToken,
                                message: 'Please check your email for the reset password link'
                            });

                            console.log('Email sent: ' + info.response);
                        };
                    });
                }

            };
        } else {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        };
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    };
};

// User reset password link -> api/users/resetpassword/ -> PATCH
//authenticated: false 
ctrl.checkResetPassword = async (req, res) => {

    const {
        errors,
        isValid
    } = validation.validateResetPasswordInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {

        const temporaryToken = req.params.token;
        const {
            newPassword
        } = req.body;

        const user = await User.findOne({
            resetPasswordToken: temporaryToken
        });

        //console.log(user);
        if (user) {
            const token = user.resetPasswordToken;
            //console.log(token);
            await jwt.verify(token, process.env.SECRET, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Reset password link has expired'
                    });
                } else if (!user) {
                    res.json({
                        success: false,
                        message: 'Reset password link has expired'
                    });
                } else {

                    bcrypt.genSalt(10, async (err, salt) => {
                        bcrypt.hash(newPassword, salt, async (err, hash) => {
                            if (err) throw err;
                            newResetPassword = hash;
                            const result = await User.updateOne({
                                resetPasswordToken: token
                            }, {
                                $set: {
                                    password: newResetPassword,
                                    resetPasswordToken: false
                                }
                            });

                            if (result) {

                                const mailOptions = {
                                    from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                                    to: user.email,
                                    subject: 'Reset Password',
                                    text: 'Hello ' + user.name + ', Your password has been successfully changed!',
                                    html: '<h1>Helo</h1><strong>' + user.name + '</strong>, <br><br> Your password has been successfully changed!'
                                };

                                confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    };
                                });

                                res.json({
                                    result,
                                    success: true,
                                    message: 'Password edited successfully'
                                });
                            } else {
                                errors.token = 'Reset password link has expired';
                                return res.status(400).json(errors);
                            }
                        });
                    });

                };
            });
        } else {
            errors.token = 'Reset password link has expired';
            return res.status(400).json(errors);
        };

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Reset password link has expired'
        });
    };
};

module.exports = ctrl;