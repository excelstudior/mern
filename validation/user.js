const Validator = require('validator');
const { isEmpty } = require('./ud_validation');


module.exports = function validateUserInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.isActive = !isEmpty(data.isActive) ? data.isActive : '';

    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = "name field can'' be empty";
    }

    if (!Validator.isEmpty(data.isActive)) {
        if (!Validator.isBoolean(data.isActive)) {
            errors.isActive = 'from field needs to be a boolean'
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}