const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getAnalytics = {
    // params: Joi.object().keys({
    //     userId: Joi.required().custom(objectId).required()
    // })
};

module.exports = {
    getAnalytics
};
