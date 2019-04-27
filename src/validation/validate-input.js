const validator = require('validator');
const isEmpty = require('./is-empty');

const ctrl = {};

ctrl.validateSignupInput = (data) => {

    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

    if (!validator.isLength(data.name, {
            min: 2,
            max: 30
        })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }
    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    if (!validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = 'Password must be at least 6 characters';
    }
    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm Password field is required';
    }
    if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must match';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
};

ctrl.validateSigninInput = (data) => {

    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};

ctrl.validateTaskInput = (data) => {

    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.description = !isEmpty(data.description) ? data.description : '';
    data.author = !isEmpty(data.author) ? data.author : '';
    data.genres = !isEmpty(data.genres) ? data.genres : '';

    if (validator.isEmpty(data.title)) {
        errors.title = 'Title field is required';
    }

    if (validator.isEmpty(data.description)) {
        errors.description = 'Description field is required';
    }

    if (validator.isEmpty(data.author)) {
        errors.author = 'Author field is required';
    }

    if (validator.isEmpty(data.genres)) {
        errors.genres = 'Genres field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};

ctrl.validateResendInput = (data) => {

    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};

ctrl.validateResetPasswordInput = (data) => {

    let errors = {};

    data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

    if (validator.isEmpty(data.newPassword)) {
        errors.newPassword = 'New Password field is required';
    }
    if (!validator.isLength(data.newPassword, {
            min: 6,
            max: 30
        })) {
        errors.newPassword = 'New Password must be at least 6 characters';
    }
    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm Password field is required';
    }
    if (!validator.equals(data.newPassword, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must match';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }

};

ctrl.validateUserSwttingsNameInput = (data) => {

    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';

    if (validator.isEmpty(data.name)) {
        errors.name = 'name field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};

ctrl.validateAdminUpdateUserInput = (data) => {

    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.active = !isEmpty(data.active) ? data.active : '';

    if (!validator.isLength(data.name, {
            min: 2,
            max: 30
        })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }
    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (validator.isEmpty(data.role)) {
        errors.role = 'Role field is required';
    }

    if (!validator.isBoolean(data.active)) {
        errors.active = 'Active field is not a boolean';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};

module.exports = ctrl;