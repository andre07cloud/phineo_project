const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { responseValidation } = require('../../validations');
const { responseController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('createCourses'), validate(responseValidation.createResponse), responseController.createResponse)
  .get(auth('getCourses'), validate(responseValidation.getResponses), responseController.getResponses);

router
  .route('/:responseId')
  .get(auth('getCourses'), validate(responseValidation.getResponse), responseController.getResponse)
  .patch(auth('getCourses'), validate(responseValidation.updateResponse), responseController.updateResponse)
  .delete(auth('manageCourses'), validate(responseValidation.deleteResponse), responseController.deleteResponse);

router
  .route('/:responseId/addResponse')
  .post(auth('getCourses'), validate(responseValidation.addModuleResponse), responseController.addModuleResponse);

module.exports = router;
