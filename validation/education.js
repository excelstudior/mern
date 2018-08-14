const Validator = require('validator');
const { isEmpty, isDate } = require('./ud_validation');
//Validator only valid single string, so need to convert it to string then use Validator to validate

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    data.current = !isEmpty(data.current) ? data.current : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = 'School field is required';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required';
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