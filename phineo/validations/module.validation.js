const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createModule = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
    sectionId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required().allow(''),
    type: Joi.string().required(),
    filePath: Joi.string().optional().allow(''),
    content: Joi.string().optional().allow(''),
    quizContent: Joi.object(),
    conditions: Joi.object().required(),
    accessConditions: Joi.object(),
  }),
};

const getModules = {
  query: Joi.object().keys({
    moduleId: Joi.array().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
    courseId: Joi.string().custom(objectId),
  }),
};

const getComments = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
};

const updateModule = {
  params: Joi.object().keys({
    moduleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      description: Joi.string().required().allow(''),
      type: Joi.string(),
      filePath: Joi.string().allow(''),
      content: Joi.string().allow(''),
      quizContent: Joi.object(),
      conditions: Joi.object(),
      accessConditions: Joi.object(),
    })
    .min(1),
};

const deleteModule = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
    sectionId: Joi.required().custom(objectId),
    moduleId: Joi.required().custom(objectId),
  }),
};

const getModuleComments = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
};

const updateModuleComments = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      comment: Joi.string().required(),
      userId: Joi.string().custom(objectId),
      time: Joi.date().required(),
    })
    .min(1),
};

const updateModuleCommentReply = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      commentId: Joi.string().custom(objectId),
      commentReply: Joi.object().required(),
    })
    .min(1),
};

//validation module validated
const validateModuleComment = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
    commentId: Joi.string().custom(objectId),
  })
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  getModuleComments,
  updateModuleComments,
  updateModuleCommentReply,
  validateModuleComment,
  getComments
};
