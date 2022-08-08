const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createInteractionMessage = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    daysAfter: Joi.number().required(),
    hourOfTheDay: Joi.number().required(),
    minuteOfTheDay: Joi.number().required(),
    title: Joi.string().required(),
    content: Joi.object(),
  }),
};

const getInteractionsMessage = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInteractionMessage = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
    interactionMessageId: Joi.string().custom(objectId).required(),
  }),
};

const updateInteractionMessage = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
    interactionMessageId: Joi.required().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      daysAfter: Joi.number(),
      hourOfTheDay: Joi.number(),
      minuteOfTheDay: Joi.number(),
      title: Joi.string(),
      content: Joi.object(),
    })
    .min(1),
};

const deleteInteractionMessage = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
    interactionMessageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createInteractionMessage,
  getInteractionsMessage,
  getInteractionMessage,
  updateInteractionMessage,
  deleteInteractionMessage,
};
