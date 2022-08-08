const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createInteraction = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    teacher: Joi.string().required().custom(objectId),
  }),
};

const getInteractions = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInteraction = {
  params: Joi.object().keys({
    interactionId: Joi.string().custom(objectId),
  }),
};

const updateInteraction = {
  params: Joi.object().keys({
    interactionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().disallow(""),
      interactions: Joi.array(),
    })
    .min(1),
};

const updateAssignments = {
  params: Joi.object().keys({
    interactionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      users: Joi.array(),
    }),
};

const deleteInteraction = {
  params: Joi.object().keys({
    interactionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createInteraction,
  getInteractions,
  getInteraction,
  updateInteraction,
  updateAssignments,
  deleteInteraction,
};
