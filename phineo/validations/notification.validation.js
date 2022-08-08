const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
    body: Joi.object().keys({
        subscription: Joi.string().allow("")
    }),
};

const registerSubscription = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId).required()
    }),
    body: Joi.object().keys({
        subscription: Joi.string().allow("")
    }),
};

module.exports = {
    createNotification,
    registerSubscription
};
