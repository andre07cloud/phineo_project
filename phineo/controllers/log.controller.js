const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { logService } = require('../services');
const ApiError = require('../utils/ApiError');

const createLog = catchAsync(async (req, res) => {
  const log = await logService.createLog(req.user.id, 'visit', req.body.pageName, req.body.params);
  res.status(httpStatus.CREATED).send('OK');
});

const createStayLog = catchAsync(async (req, res) => {
  const log = await logService.createLog(req.user.id, 'stay', req.body.pageName, req.body);
  res.status(httpStatus.CREATED).send('OK');
});

const createViewLog = catchAsync(async (req, res) => {
  const log = await logService.createViewLog(req.user.id, 'visit', req.body.pageName);
  res.status(httpStatus.CREATED).send('OK');
});

const getLogsCourse = catchAsync(async (req, res) => {
  const logs = await logService.getLogsByCourseId(req.params.courseId);
  res.send(logs);
});

const getUserLogsCourse = catchAsync(async (req, res) => {
  const logs = await logService.getUserLogsByCourseId(req.params.userId, req.params.courseId);
  res.json(logs);
});

module.exports = {
  createLog,
  createStayLog,
  createViewLog,
  getLogsCourse,
  getUserLogsCourse,
};
