const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { responseService } = require('../services');

const createResponse = catchAsync(async (req, res) => {
  const response = await responseService.createResponse(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const getResponses = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await responseService.queryResponses(filter, options);
  res.send(result);
});

const getResponse = catchAsync(async (req, res) => {
  const response = await responseService.getResponseById(req.params.responseId);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Response not found');
  }
  res.send(response);
});

const updateResponse = catchAsync(async (req, res) => {
  const response = await responseService.updateResponseById(req.params.responseId, req.body);
  res.send(response);
});

const deleteResponse = catchAsync(async (req, res) => {
  await responseService.deleteResponseById(req.params.responseId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addModuleResponse = catchAsync(async (req, res) => {
  const response = await responseService.addModuleResponseById(req.params.responseId, req.body);
  res.send(response);
});

module.exports = {
  createResponse,
  getResponses,
  getResponse,
  updateResponse,
  deleteResponse,
  addModuleResponse,
};
