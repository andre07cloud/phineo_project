const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { correctionService } = require('../services');
const { Correction } = require('../models');
const ApiError = require('../utils/ApiError');

const addCorrectionUser = catchAsync(async (req, res) => {
  const createCorrectionUser = await correctionService.createCorrection(
    req.body.filePath,
    req.body.courseId,
    req.body.userId,
    req.body.moduleId
  );
  res.status(httpStatus.OK).send('OK');
});

const getSpecificCorrection = catchAsync(async (req, res) => {
  const commandes = await Correction.findOne({
    userId: req.params.userId,
    courseId: req.params.courseId,
    moduleId: req.params.moduleId,
  }).sort({ uploadAt: -1 });
  res.send(commandes);
});

getCorrectionCourse = catchAsync(async (req, res) => {
  const corrections = await correctionService.getCorrectionByCourseId(req.params.courseId);
  res.send(corrections);
});

module.exports = {
  addCorrectionUser,
  getSpecificCorrection,
  getCorrectionCourse,
};
