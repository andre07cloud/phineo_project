const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
  courseValidation,
  sectionValidation,
  moduleValidation,
  assignmentsValidation,
  interactionMessageValidation,
} = require('../../validations');
const {
  sectionController,
  courseController,
  moduleController,
  assignmentsController,
  interactionMessageController,
  tagController,
} = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('createCourses'), validate(courseValidation.createCourse), courseController.createCourse)
  .get(auth('getCourses'), validate(courseValidation.getCourses), courseController.getCourses);

router.route('/interactions').get(auth('getCourses'), courseController.getCoursesForInteraction);

router.route('/interaction-info/:courseId').get(auth('getCourses'), courseController.getCourseDetailForInteraction);

router
  .route('/:courseId/interactions/user/:userId')
  .get(auth('getCourses'), courseController.getInteractionUser)
  .post(
    auth('getCourses'),
    validate(courseValidation.addResponseUserInteraction),
    courseController.addResponseUserInteraction
  );

router.route('/:courseId/interactions/user/:userId/suit').post(auth('getCourses'), courseController.getInteractionUserSuit);

router
  .route('/:courseId/interactions/user/:userId/suitAfterPersonalizedMessage')
  .post(auth('getCourses'), courseController.getInteractionUserSuitAfterPersonalizedMessage);

router
  .route('/:courseId')
  .get(auth('getCourses'), validate(courseValidation.getCourse), courseController.getFullCourse)
  .patch(auth('manageCourses'), validate(courseValidation.updateCourse), courseController.updateCourse)
  .delete(auth('manageCourses'), validate(courseValidation.deleteCourse), courseController.deleteCourse);

router
  .route('/:courseId/teacher')
  .patch(auth('admin'), validate(courseValidation.updateTeacher), courseController.updateCourseTeacher);

router
  .route('/:courseId/phineo')
  .get(auth('getCourses'), validate(courseValidation.getCourse), courseController.getPhineoCourse);

router
  .route('/:courseId/knowledge')
  .patch(auth('getCourses'), validate(courseValidation.updateCourseComments), courseController.updateCourseComments);

router
  .route('/:courseId/knowledge/:commentId')
  .delete(auth('manageCourses'), validate(courseValidation.deleteCourseComment), courseController.deleteCourseComment);

router
  .route('/:courseId/image')
  .patch(auth('manageCourses'), validate(courseValidation.updateImage), courseController.updateImage);

router
  .route('/:courseId/duplication')
  .post(auth('admin'), validate(courseValidation.duplicateCourse), courseController.duplicateCourse);

router
  .route('/:courseId/tag')
  .get(auth('getCourses'), validate(courseValidation.getCourseTags), tagController.getCourseTags)
  .post(auth('teacher'), validate(courseValidation.createTag), tagController.createTag);

router
  .route('/:courseId/section/:sectionId/module/:moduleId/sectionsOrder')
  .patch(auth('manageCourses'), validate(courseValidation.updateCourseSectionsOrder), courseController.updateCourse);

router
  .route('/:courseId/section')
  .post(auth('createCourses'), validate(sectionValidation.createSection), sectionController.createSection)
  .get(auth('getCourses'), validate(sectionValidation.getSections), sectionController.getSections);

router
  .route('/:courseId/section/:sectionId')
  .get(auth('getCourses'), validate(sectionValidation.getSection), sectionController.getSection)
  .patch(auth('manageCourses'), validate(sectionValidation.updateSection), sectionController.updateSection)
  .delete(auth('manageCourses'), validate(sectionValidation.deleteSection), sectionController.deleteSection);

router
  .route('/:courseId/section/:sectionId/sectionModulesOrder')
  .patch(auth('manageCourses'), validate(sectionValidation.updateSectionModulesOrder), sectionController.updateSection);

router
  .route('/:courseId/section/:sectionId/module')
  .post(auth('createCourses'), validate(moduleValidation.createModule), moduleController.createModule)
  .get(auth('getCourses'), validate(moduleValidation.getModules), moduleController.getModules);

router
  .route('/:courseId/section/:sectionId/module/:moduleId')
  .get(auth('getCourses'), validate(moduleValidation.getModule), moduleController.getModule)
  .patch(auth('manageCourses'), validate(moduleValidation.updateModule), moduleController.updateModule)
  .delete(auth('manageCourses'), validate(moduleValidation.deleteModule), moduleController.deleteModule);

router
  .route('/:courseId/assignments')
  .get(auth('getCourses'), validate(assignmentsValidation.getAssignments), assignmentsController.getAssignments)
  .post(auth('createCourses'), validate(assignmentsValidation.updateAssignments), assignmentsController.updateAssignments);

router
  .route('/:courseId/interaction')
  .post(
    auth('createInteractions'),
    validate(interactionMessageValidation.createInteractionMessage),
    interactionMessageController.createInteractionMessage
  )
  .get(
    auth('getInteractions'),
    validate(interactionMessageValidation.getInteractionsMessage),
    interactionMessageController.getCourseInteractionMessage
  );

router
  .route('/:courseId/interaction/:interactionMessageId')
  .get(
    auth('getInteractions'),
    validate(interactionMessageValidation.getInteractionMessage),
    interactionMessageController.getInteractionMessage
  )
  .patch(
    auth('manageInteractions'),
    validate(interactionMessageValidation.updateInteractionMessage),
    interactionMessageController.updateInteraction
  )
  .delete(
    auth('manageInteractions'),
    validate(interactionMessageValidation.deleteInteractionMessage),
    interactionMessageController.deleteInteractions
  );

module.exports = router;
