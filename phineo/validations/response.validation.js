const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createResponse = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    modulesResponse: Joi.array(),
    progress: Joi.number(),
  }),
};

const getResponses = {
  query: Joi.object().keys({
    responseIds: Joi.array().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getResponse = {
  params: Joi.object().keys({
    responseId: Joi.string().custom(objectId),
  }),
};

const updateResponse = {
  params: Joi.object().keys({
    responseId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().required().custom(objectId),
      modulesResponse: Joi.object(),
      progress: Joi.number(),
      timeOnCourse: Joi.string(),
    })
    .min(1),
};

const addModuleResponse = {
  params: Joi.object().keys({
    responseId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      courseId: Joi.string().custom(objectId),
      moduleResponse: Joi.object(),
    })
    .min(1),
};

const deleteResponse = {
  params: Joi.object().keys({
    responseId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createResponse,
  getResponses,
  getResponse,
  updateResponse,
  deleteResponse,
  addModuleResponse,
};
