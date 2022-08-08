var moment = require('moment');

const addDaysToDateWithHours = (date, days, hours) => {
    var newDateObj = moment(date).add(days, 'd').toDate();
    newDateObj.setUTCHours(hours)
    return newDateObj;
}

const addMinutesToDateWithHours = (date, hours, minutes) => {
    var newDateObj = moment(date).add(minutes, 'm').toDate();
    newDateObj.setUTCHours(hours)
    return newDateObj;
}

module.exports = {
    addDaysToDateWithHours,
    addMinutesToDateWithHours
}