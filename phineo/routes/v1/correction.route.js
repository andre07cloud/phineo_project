const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { correctionValidation } = require('../../validations');
const { correctionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  // .get(auth('createCourses'), logController.getCommandes)
  .post(auth('user'), validate(correctionValidation.addCorrectionUser), correctionController.addCorrectionUser);

router
  .route('/course/:courseId')
  // .post(auth('user'), validate(correctionValidation.addCorrectionUser), correctionController.addCorrectionUser);
  .get(auth('createCourses'), correctionController.getCorrectionCourse);

router
  .route('/user/:userId/course/:courseId/module/:moduleId')
  // .post(auth('user'), validate(correctionValidation.addCorrectionUser), correctionController.addCorrectionUser);
  .get(auth('createCourses'), correctionController.getSpecificCorrection);

module.exports = router;
