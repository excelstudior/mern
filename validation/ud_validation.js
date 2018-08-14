const isEmpty = value =>
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
const isDate = value =>
    !isNaN(Date.parse(value)) ;
module.exports = {
    isEmpty,
    isDate
};
