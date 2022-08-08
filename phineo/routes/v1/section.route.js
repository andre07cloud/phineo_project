const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { sectionValidation } = require('../../validations');
const { sectionController } = require('../../controllers');

const router = express.Router();

// router
//   .route('/')
//   .post(auth('createCourses'), validate(sectionValidation.createSection), sectionController.createSection)
//   .get(auth('getCourses'), validate(sectionValidation.getSections), sectionController.getSections);

router
  .route('/:sectionId')
  .get(auth('getCourses'), validate(sectionValidation.getSection), sectionController.getSection)
  .patch(auth('manageCourses'), validate(sectionValidation.updateSection), sectionController.updateSection)
  .delete(auth('manageCourses'), validate(sectionValidation.deleteSection), sectionController.deleteSection);

module.exports = router;