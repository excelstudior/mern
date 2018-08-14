const Validator = require('validator');
const { isEmpty, isDate } = require('./ud_validation');
//Validator only valid single string, so need to convert it to string then use Validator to validate

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    data.current = !isEmpty(data.current) ? data.current : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Job title field is required';
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'Company field is required';
    }

    if (!Validator.isEmpty(data.from)) {
        if (!isDate(data.from)) {
            errors.from = 'from field needs to be a date format'
        }
    } else {
        errors.from = 'from field is required';
    }

    if (Validator.isEmpty(data.current)) {
        errors.current = 'Current field is required';
    } else if (!Validator.isBoolean(data.current)) {
        errors.current = 'from field needs to be a boolean'
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}