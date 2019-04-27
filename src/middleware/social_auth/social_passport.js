const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const confNodemailer = require('../../config/nodemailer');

const User = require('../../models/user');
module.exports = function (app, passport) {
    app.use(passport.initialize())
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        proxy: true,
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: true
        }
    }));

    passport.serializeUser(async function (user, done) {
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };
        token = await jwt.sign(payload, process.env.SECRET, {
            expiresIn: 60 * 60
        });

        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_APP_CALLBACKURL,
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile)
            User.findOne({
                email: profile._json.email
            }, async function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user && user != null) {
                    done(null, user);
                } else {
                    const temp_pass = crypto.randomBytes(5).toString('hex');
                    console.log(temp_pass);
                    newUser = new User({
                        name: profile._json.name,
                        given_name: profile.name.givenName,
                        family_name: profile.name.familyName,
                        facebook_picture: profile.photos[0].value,
                        email: profile._json.email,
                        active: true,
                        password: temp_pass
                    });
                    const payload = {
                        name: profile._json.name,
                        email: profile._json.email,
                    };
                    newUser.temporaryToken = await jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 60 * 60
                    });
                    //Token sent to user by nodemailer
                    console.log(newUser.temporaryToken);

                    const mailOptions = {
                        from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                        to: profile._json.email,
                        subject: 'First Access - Change Password',
                        text: 'Hello ' + profile._json.name + ', thak you for registering at LShare.com. Please use the following password to complete your activation: <br><br>' + 'Temporary Password: ' + temp_pass,
                        html: '<h1>Helo</h1><strong>' + profile._json.name + '</strong> <br><br> thak you for registering at LShare.com. Please use the following password to complete your activation: <br><br>' + 'Temporary Password: ' + temp_pass,
                    };

                    confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            bcrypt.genSalt(10, async (err, salt) => {
                                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser.save(function (err) {
                                        if (err) return done(err);
                                        done(err, newUser);
                                    });
                                });
                            });

                            console.log('Email sent: ' + info.response);
                        };
                    });
                }
            }).select('name email avatar role active temporaryToken resetPasswordToken _id');
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_APP_CALLBACKURL
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile)
            User.findOne({
                email: profile.emails[0].value
            }, async function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user && user != null) {
                    done(null, user);
                } else {
                    const temp_pass = crypto.randomBytes(5).toString('hex');
                    console.log(temp_pass);
                    newUser = new User({
                        name: profile._json.name,
                        given_name: profile._json.given_name,
                        family_name: profile._json.family_name,
                        google_picture: profile._json.picture,
                        email: profile._json.email,
                        active: profile._json.email_verified,
                        password: temp_pass
                    });
                    const payload = {
                        name: profile._json.name,
                        email: profile._json.email,
                    };
                    newUser.temporaryToken = await jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 60 * 60
                    });
                    //Token sent to user by nodemailer
                    console.log(newUser.temporaryToken);

                    const mailOptions = {
                        from: process.env.MAIL_USERNAME + process.env.MAIL_USER,
                        to: profile._json.email,
                        subject: 'First Access - Change Password',
                        text: 'Hello ' + profile._json.name + ', thak you for registering at LShare.com. Please use the following password to complete your activation: <br><br>' + 'Temporary Password: ' + temp_pass,
                        html: '<h1>Helo</h1><strong>' + profile._json.name + '</strong> <br><br> thak you for registering at LShare.com. Please use the following password to complete your activation: <br><br>' + 'Temporary Password: ' + temp_pass,
                    };

                    confNodemailer.transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            bcrypt.genSalt(10, async (err, salt) => {
                                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser.save(function (err) {
                                        if (err) return done(err);
                                        done(err, newUser);
                                    });
                                });
                            });

                            console.log('Email sent: ' + info.response);
                        };
                    });
                }
            }).select('name email avatar role active temporaryToken resetPasswordToken _id');

        }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), function (req, res) {
        res.redirect('/facebook/' + token);
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: 'email'
        })
    );

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/google/' + token);
        });
    return passport;
}