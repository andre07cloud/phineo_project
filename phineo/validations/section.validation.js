const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSection = {
    params: Joi.object().keys({
        courseId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        modules: Joi.array()
    }),
};

const getSections = {
    query: Joi.object().keys({
        teacherId: Joi.string().custom(objectId),
        userId: Joi.string().custom(objectId),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getSection = {
    params: Joi.object().keys({
        sectionId: Joi.string().custom(objectId),
        courseId: Joi.string().custom(objectId).allow(""),
    }),
};

const updateSection = {
    params: Joi.object().keys({
        sectionId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            description: Joi.string(),
            modules: Joi.array()
        })
        .min(1),
};

const updateSectionModulesOrder = {
    params: Joi.object().keys({
        sectionId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object()
        .keys({
            modules: Joi.array()
        })
        .min(1),
};

const deleteSection = {
    params: Joi.object().keys({
        sectionId: Joi.string().custom(objectId),
        courseId: Joi.string().custom(objectId).allow(""),
    }),
};

module.exports = {
    createSection,
    getSections,
    getSection,
    updateSection,
    updateSectionModulesOrder,
    deleteSection,
};
