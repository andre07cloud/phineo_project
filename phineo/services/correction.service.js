const httpStatus = require('http-status');
const axios = require('axios');
const qs = require('qs');
const { Correction } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const createCorrection = async (filePath, courseId, userId, moduleId) => {
  const correction = {
    filePath,
    courseId,
    userId,
    moduleId,
  };
  return Correction.create(correction);
};

const getCorrectionByCourseId = async (courseId) => {
  const corrections = await Correction.find({ courseId })
    .sort({ moduleId: 1, createdAt: -1 })
    .select('userId moduleId filePath uploadAt')
    .populate({ path: 'userId', select: 'firstName lastName role' })
    .populate({ path: 'moduleId', select: 'title' });
  return corrections;
};

module.exports = {
  createCorrection,
  getCorrectionByCourseId,
};
