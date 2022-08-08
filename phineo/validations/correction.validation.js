const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addCorrectionUser = {
  body: Joi.object().keys({
    filePath: Joi.string(),
    userId: Joi.string().required().custom(objectId),
    courseId: Joi.string().required().custom(objectId),
    moduleId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  addCorrectionUser,
};
