const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getAssignments = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        assignments: Joi.array().required()
    }),
};

const updateAssignments = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object()
        .keys({
            assignments: Joi.array().required()
        })
        .min(1),
};

module.exports = {
    getAssignments,
    updateAssignments
};
