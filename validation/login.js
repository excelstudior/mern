const Validator = require('validator');
const {isEmpty} = require('./ud_validation');


module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
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



    return {
        errors,
        isValid: isEmpty(errors)
    }
}