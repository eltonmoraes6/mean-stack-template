const titleCase = require('title-case');
const cloudinary = require('cloudinary');

const User = require('../models/user');
const Task = require('../models/task');
const validation = require('../validation/validate-input');

const ctrl = {};

// Find all Users - ADM restriction -> api/admin/users -> GET
//authenticated: true
ctrl.find_all_users = async (req, res) => {

    try {
        const decoded = req.decoded
        const admin = await User.findById(decoded.id).select('email name _id role');
        if (admin.role === 'admin') {

            const users = await User.find({})
                .sort({
                    createdAt: -1
                })
                .select('email name avatar google_picture facebook_picture role _id ');

            if (users) {
                const respose = {
                    count: users.length,
                    data: users.map(doc => {
                        return {
                            name: doc.name,
                            email: doc.email,
                            password: doc.password,
                            avatar: doc.avatar,
                            role: doc.role,
                            google_picture: doc.google_picture,
                            facebook_picture: doc.facebook_picture,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: process.env.WEB_API_URL + 'users/' + doc._id
                            }
                        }

                    }),
                    result: users.filter((docs => {
                        return docs.role === 'user';
                    }))
                }
                if (users.length >= 0) {
                    res.status(200).json(respose);
                } else {
                    res.status(404).json({
                        message: 'No entries found'
                    });
                };
            }

        } else {
            res.json({
                message: 'User has no permission'
            });
        };

    } catch (err) {

        console.log(err);
        res.status(404).json({
            message: 'No entries found'
        });

    };

};

// Get single user ById-> api/admin/user/:id -> GET
//authenticated: true
ctrl.get_user_by_id = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const user = await User.findById({
                _id: id
            })
            .select('email name avatar google_picture facebook_picture role active _id ');

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

// Remove single user ById-> api/admin/user/:id -> DELETE
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

            if (user.avatar_public_id) {
                await cloudinary.v2.uploader.destroy(user.avatar_public_id);
            }

            const task = await Task.find({
                user: user._id
            }).select('user');

            if (task) {
                await task.forEach(function (doc) {
                    doc.remove();
                });
            }
            await User.remove({
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

// Update user -> api/admin/update/user/:id -> PATCH
//authenticated: true
ctrl.update_user = async (req, res) => {

    const {
        errors,
        isValid
    } = validation.validateAdminUpdateUserInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {
        const id = req.params.id;

        const {
            name,
            email,
            role,
            active,
        } = req.body;

        const updateUser = ({
            name: titleCase(name),
            email,
            role,
            active,
        });

        const result = await User.updateOne({
            _id: id
        }, {
            $set: updateUser,
            temporaryToken: 'false',
            resetPasswordToken: 'false',
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

module.exports = ctrl;