const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { emailService, userService } = require('../services');
const ApiError = require('../utils/ApiError');

const sendSupport = catchAsync(async (req, res) => {
  await emailService.sendSupportEmail(req.body.email, req.body.firstName, req.body.message, req.body.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendInscriptionCourse = catchAsync(async (req, res) => {
  await emailService.sendInscriptionCourseEmail(
    req.body.email,
    req.body.firstName,
    req.body.cpf,
    req.body.temps,
    req.body.offre,
    req.body.message,
    req.body.userId
  );
  res.status(httpStatus.NO_CONTENT).send();
});

const sendTeacherSupport = catchAsync(async (req, res) => {
  const user = await userService.getUserInfosById(req.body.teacherId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await emailService.sendTeacherSupportEmail(req.body.email, req.body.firstName, req.body.message, user.email);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  sendSupport,
  sendTeacherSupport,
  sendInscriptionCourse,
};
