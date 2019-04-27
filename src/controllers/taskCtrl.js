const Task = require('../models/task');
const validation = require('../validation/validate-input');
const titleCase = require('title-case');
const fs = require("fs");
const cloudinary = require('cloudinary');
const {
    format
} = require('timeago.js');

const removeFile = async (file) => {
    await fs.unlink(file, async (err) => {
        if (err) {
            throw err;
        } else {
            console.log('File unlinked');
        };
    });
}

const ctrl = {};

// create task -> api/task/ -> POST
//authenticated: true 
ctrl.create_task = async (req, res, next) => {

    const {
        errors,
        isValid
    } = validation.validateTaskInput(req.body);

    if (req.body.number === 0 || req.body.number === undefined) {
        errors.number = 'Number field is required and needs to be greater than 0';
        return res.status(404).json(errors);
    }

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {


        if (req.file) {
            const {
                title,
                description,
                number,
                author,
                genres
            } = req.body;


            const fileExts = ['png', 'jpg', 'jpeg', 'gif']
            // Check allowed extensions
            let isAllowedExt = fileExts.includes(req.file.originalname.split('.')[1].toLowerCase());
            // Mime type must be an image
            let isAllowedMimeType = req.file.mimetype.startsWith("image/")

            if (isAllowedExt && isAllowedMimeType) {
                itemIds = [];
                for (var i = 1; i <= number; i++) {
                    var obj = {};
                    obj.volume = 'vol-' + i;
                    obj.value = false;
                    itemIds.push(obj);
                }

                const newAvatar = req.file.path;
                const imgCloud = await cloudinary.v2.uploader.upload(newAvatar);

                const newTask = new Task({
                    title: titleCase(title),
                    description,
                    checkdata: itemIds,
                    author: titleCase(author),
                    genres,
                    avatar: imgCloud.url,
                    avatar_public_id: imgCloud.public_id
                });

                newTask.user = req.decoded.id;
                const result = await newTask.save();

                if (result) {
                    removeFile(newAvatar);
                    res.status(201).json({
                        success: true,
                        message: 'Task created!',
                        data: {
                            title: result.title,
                            description: result.description,
                            user: result.user,
                            author: result.author,
                            genres: result.genres,
                            checkdata: result.checkdata,
                            avatar: result.avatar,
                            avatar_public_id: result.avatar_public_id,
                            request: {
                                type: 'GET',
                                url: process.env.WEB_API_URL + 'task/'
                            }
                        }
                    });

                }
            } else {
                removeFile(req.file.path);
                // pass error msg to callback, which can be displaye in frontend
                errors.file = 'Only allowed' + fileExts + 'files';
                return res.status(404).json(errors);
            }
        } else {
            errors.file = 'file not provided, pleasee choose a file and try again.';
            return res.status(404).json(errors);
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err
        });
    };
};

// Get all tasks -> api/task/ -> GET
//authenticated: true
ctrl.get_all_task = async (req, res, next) => {
    try {
        const docs = await Task.find({
                user: req.decoded.id
            }).sort({
                date: 'desc'
            })
            .select('user title description checkdata author genres avatar avatar_public_id date _id')
        if (docs) {
            res.status(200).json({
                count: docs.length,
                data: docs.map(doc => {
                    return {
                        _id: doc._id,
                        user: doc.user,
                        title: doc.title,
                        description: doc.description,
                        author: doc.author,
                        genres: doc.genres,
                        checkdata: doc.checkdata,
                        avatar: doc.avatar,
                        avatar_public_id: doc.avatar_public_id,
                        date: format(doc.date),
                        request: {
                            type: 'GET',
                            url: process.env.WEB_API_URL + 'task/' + doc._id
                        }
                    }
                })
            });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Tasks not found'
        });
    };

};

// Get single task ById-> api/task/:id -> GET
//authenticated: true
ctrl.get_task_by_id = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;
        const task = await Task.findById({
                _id: id
            })
            .select('user title checkdata description author genres avatar avatar_public_id date _id');
        if (task) {
            res.status(200).json({
                task: task,
                date: format(task.date),
                request: {
                    type: 'GET',
                    url: process.env.WEB_API_URL + 'task/'
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Task not found'
        });
    };

};

// Remove single task ById-> api/task/:id -> DELETE
//authenticated: true
ctrl.remove_task = async (req, res) => {

    try {
        const {
            id
        } = req.params;
        const task = await Task.findOne({
            _id: id
        });
        console.log(task.avatar_public_id);

        if (task) {
            await cloudinary.v2.uploader.destroy(task.avatar_public_id);

            const result = await Task.deleteOne({
                _id: id
            });

            if (result) {
                res.status(200).json({
                    success: true,
                    message: 'Task deleted',
                });
            }
        } else {
            res.status(404).json({
                message: 'Task not found'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Task not found'
        });
    };

};

// Update task -> api/update/:id -> PATCH
//authenticated: true
ctrl.update_task = async (req, res) => {
    const {
        errors,
        isValid
    } = validation.validateTaskInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    try {
        const id = req.params.id;

        const {
            title,
            description,
            author,
            genres,
            checkdata,
        } = req.body;

        const updateTask = ({
            title: titleCase(title),
            description,
            author: titleCase(author),
            genres,
            checkdata,
        });

        const result = await Task.updateOne({
            _id: id
        }, {
            $set: updateTask
        });

        if (result) {
            res.status(200).json({
                message: 'Task updated successfully',
                success: true,
                request: {
                    type: 'GET',
                    url: process.env.WEB_API_URL + 'task/'
                }
            });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Task not found'
        });
    };
};


ctrl.update_task_avatar = async (req, res) => {
    const errors = {};
    try {
        const {
            id
        } = req.params;
        if (req.file) {

            const newAvatar = req.file.path;
            console.log(newAvatar)
            const removeFile = await Task.findOne({
                _id: id
            });

            const imgCloud = await cloudinary.v2.uploader.upload(newAvatar);

            if (removeFile.avatar) {

                const result = await Task.updateOne({
                    _id: id
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
            errors.file = 'No Image provided';
            return res.status(400).json(errors);
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'No image provided'
        });
    };

};


module.exports = ctrl;