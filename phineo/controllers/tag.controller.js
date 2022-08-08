const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tagService } = require('../services');
const ApiError = require('../utils/ApiError');

const createTag = catchAsync(async (req, res) => {
  const tag = await tagService.createTag(req.params.courseId, req.body.tag);
  res.send(tag);
});

const getCourseTags = catchAsync(async (req, res) => {
  const tag = await tagService.getCourseTagsById(req.params.courseId);
  res.send(tag);
});

module.exports = {
  createTag,
  getCourseTags,
};
