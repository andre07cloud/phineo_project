const express = require('express');
const emailController = require('../../controllers/email.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/support', auth('getCourses'), emailController.sendSupport);

router.post('/teacher-support', auth('getCourses'), emailController.sendTeacherSupport);

router.post('/incription-course', auth('getCourses'), emailController.sendInscriptionCourse);

module.exports = router;
