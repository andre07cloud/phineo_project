// const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');
const { cronService } = require('../services');

const createScheduleCronWithSpecificDate = async (date, userId) => {
   cronService.createCronScheduleWithDate(date, userId);
};

module.exports = {
    createScheduleCronWithSpecificDate,
};
