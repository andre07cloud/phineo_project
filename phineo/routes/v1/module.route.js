const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { moduleValidation } = require('../../validations');
const { moduleController } = require('../../controllers');

const router = express.Router();

 router
   .route('/')
   .post(auth('createCourses'), validate(moduleValidation.createModule), moduleController.createModule)
   .get(validate(moduleValidation.getModules), moduleController.getModules);

router
  .route('/:moduleId')
  .get(auth('getCourses'), validate(moduleValidation.getModule), moduleController.getModule)
  .patch(auth('manageCourses'), validate(moduleValidation.updateModule), moduleController.updateModule)
  .delete(auth('manageCourses'), validate(moduleValidation.deleteModule), moduleController.deleteModule)


router
  .route('/:moduleId/:courseId')
  .get(auth('getCourses'), validate(moduleValidation.getModule), moduleController.getModule);

router
  .route('/:moduleId/comments')
  .get(auth('getCourses'), validate(moduleValidation.getModuleComments), moduleController.getModuleComments)
  .patch(auth('manageCourses'), validate(moduleValidation.updateModuleComments), moduleController.updateModuleComments);

router
  .route('/:moduleId/title')
  .get(auth('getCourses'), validate(moduleValidation.getModule), moduleController.getModuleTitle);

router
  .route('/:moduleId/commentReply')
  .patch(
    auth('manageCourses'),
    validate(moduleValidation.updateModuleCommentReply),
    moduleController.updateModuleCommentReply
  );

router
.route('/commentValidated/:moduleId')
.get(auth('getCourses'), validate(moduleValidation.getModule), moduleController.getValidatedModuleComments);

router
.route('/commentUnValidated/:moduleId')
.get(auth('manageCourses'), validate(moduleValidation.getModule), moduleController.getUnValidatedModuleComments);
  
router
  .route('/:moduleId/:commentId')
  .patch(
    validate(moduleValidation.validateModuleComment), 
    moduleController.validateModuleComment
  );

  router
  .route('/:moduleId/:commentId/close')
  .patch(
    validate(moduleValidation.validateModuleComment), 
    moduleController.closeModuleComment
  );
  
  router
  .route('/:moduleId/:userId')
  .get(
    
  validate(moduleValidation.getComments), 
  moduleController.getUserdModuleComments
  ); 
  router
  .route('/comments')
  .get(
    
    validate(moduleValidation.getComments), 
    moduleController.getAllComments
  );

module.exports = router;
