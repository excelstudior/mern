const Validator = require('validator');
const {isEmpty} = require('./ud_validation');


module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    // check empty email, email format
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email must be valid email address';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    // check empty password, password length
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters.';
    }
    // check empty confirm password, confirm password length
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm Password field is required';
    }

    if (!Validator.isLength(data.confirmPassword, { min: 6, max: 30 })) {
        errors.confirmPassword = 'Confirmed Password must be at least 6 characters.';
    }
    // check if password are confirm password equals

    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPasswordPassword = 'Confirmed Password is not the same as password';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}