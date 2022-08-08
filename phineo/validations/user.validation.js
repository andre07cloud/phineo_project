const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required().valid('user', 'emrys', 'admin', 'teacher'),
    courses: Joi.array(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string(),
      lastName: Joi.string(),
      role: Joi.string().valid('user', 'emrys', 'admin', 'teacher'),
      courses: Joi.array(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getCourses = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStats = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
};

const getInteractions = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
};

const updateInteractions = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
    interactionId: Joi.string().custom(objectId),
  }),
};

const removeAssignment = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().required(),
    courseId: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCourses,
  getInteractions,
  updateInteractions,
  removeAssignment,
  getStats,
};
