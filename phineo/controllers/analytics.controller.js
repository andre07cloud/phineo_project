const catchAsync = require('../utils/catchAsync');
const { analyticsService } = require('../services');

const getAnalytics = catchAsync(async (req, res) => {
    const result = await analyticsService.getGlobalAnalytics()
    res.send(result);
});

module.exports = {
    getAnalytics
};