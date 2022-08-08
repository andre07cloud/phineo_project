const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { logValidation } = require('../../validations');
const { logController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  // .get(auth('createCourses'), logController.getCommandes)
  .post(auth('getCourses'), validate(logValidation.createCommande), logController.createLog);

router
  .route('/module')
  // .get(auth('createCourses'), logController.getCommandes)
  .post(auth('getCourses'), validate(logValidation.createCommande), logController.createStayLog);

router
  .route('/view')
  // .get(auth('createCourses'), logController.getCommandes)
  .post(auth('getCourses'), validate(logValidation.createCommande), logController.createViewLog);

router
  .route('/course/:courseId')
  // .post(auth('getCourses'), validate(logValidation.createCommande), logController.createViewLog);
  .get(auth('createCourses'), logController.getLogsCourse);

router
  .route('/course/:courseId/user/:userId')
  // .post(auth('getCourses'), validate(logValidation.createCommande), logController.createViewLog);
  .get(auth('createCourses'), logController.getUserLogsCourse);

module.exports = router;
