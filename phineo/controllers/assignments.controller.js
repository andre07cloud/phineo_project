const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { assignmentsService } = require('../services');

const getAssignments = catchAsync(async (req, res) => {
  const course = await assignmentsService.getAssignmentsByID(req.params.courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  res.send(course);
});

const updateAssignments = catchAsync(async (req, res) => {
  const course = await assignmentsService.updateAssignmentsByID(req.params.courseId, req.body);
  res.send(course);
});

module.exports = {
  getAssignments,
  updateAssignments
};
