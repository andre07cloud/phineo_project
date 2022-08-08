const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { analyticsValidation } = require('../../validations');
const { analyticsController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth('getAnalytics'), validate(analyticsValidation.getAnalytics), analyticsController.getAnalytics);

module.exports = router;