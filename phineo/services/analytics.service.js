const httpStatus = require('http-status');
const { Course, Module, Response, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get course with sections by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getGlobalAnalytics = async () => {
    const users = await User.find({ courses: { $exists: true, $type: 'array', $ne: [] } });
    const userCount = await User.countDocuments({});
    const courseCount = await Course.countDocuments({});

    let courseAssign = 0
    users.map(item => courseAssign = courseAssign + item.courses.length)

    const analytics = {
        userCount: userCount,
        courseCount: courseCount,
        courseAssign: courseAssign
    }
    return analytics;
};

module.exports = {
    getGlobalAnalytics
};