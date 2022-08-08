const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { interactionValidation } = require('../../validations');
const { interactionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createInteractions'),
    validate(interactionValidation.createInteraction),
    interactionController.createInteraction
  )
  .get(auth('getInteractions'), validate(interactionValidation.getInteraction), interactionController.getFullInteraction);

router
  .route('/:interactionId')
  .get(auth('getInteractions'), validate(interactionValidation.getInteractions), interactionController.getFullInteraction)
  .patch(
    auth('manageInteractions'),
    validate(interactionValidation.updateInteraction),
    interactionController.updateInteraction
  )
  .delete(
    auth('manageInteractions'),
    validate(interactionValidation.deleteInteraction),
    interactionController.deleteInteractions
  );

module.exports = router;
