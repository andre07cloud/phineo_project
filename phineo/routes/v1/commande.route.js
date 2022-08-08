const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { commandeValidation } = require('../../validations');
const { commandeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth('createCourses'), commandeController.getCommandes)
  .post(auth('getCourses'), validate(commandeValidation.createCommande), commandeController.createCommande);

router
  .route('/:commandeId')
  .patch(auth('manageCourses'), validate(commandeValidation.updateCommande), commandeController.updateCommande);

router
  .route('/:commandeId/global')
  .patch(auth('manageCourses'), validate(commandeValidation.updateCommande), commandeController.updateGlobalCommande);

module.exports = router;
