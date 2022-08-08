const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { notificationValidation } = require('../../validations');
const { notificationController } = require('../../controllers');

const router = express.Router();

router
  .route('/test')
  .post(
    auth('notification'),
    validate(notificationValidation.createNotification),
    notificationController.createNotificationTest
  );

router
  .route('/:userId')
  .post(
    auth('notification'),
    validate(notificationValidation.registerSubscription),
    notificationController.registerUserSubscription
  );
//   .get(auth('getCourses'), validate(responseValidation.getResponse), responseController.getResponse)
//   .patch(auth('manageCourses'), validate(responseValidation.updateResponse), responseController.updateResponse)
//   .delete(auth('manageCourses'), validate(responseValidation.deleteResponse), responseController.deleteResponse);

module.exports = router;
