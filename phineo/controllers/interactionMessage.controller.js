const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { interactionMessageService } = require('../services');

const createInteractionMessage = catchAsync(async (req, res) => {
  const interaction = await interactionMessageService.createInteractionMessage(req.params.courseId, req.body);
  res.status(httpStatus.CREATED).send(interaction);
});

const getInteractions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ids']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await interactionMessageService.queryInteractionsMessage(filter, options);
  res.send(result);
});

const getInteractionsMessageAndCreateCron = async () => {
  const result = await interactionMessageService.queryInteractionsMessageToCreateCron();
  return result
};

const getInteractionMessage = catchAsync(async (req, res) => {
  const interaction = await interactionMessageService.getInteractionMessageById(req.params.interactionMessageId);
  if (!interaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }
  res.send(interaction);
});

const getCourseInteractionMessage = catchAsync(async (req, res) => {
  const interaction = await interactionMessageService.getCourseInteractionMessageById(req.params.courseId);
  if (!interaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course Interaction not found');
  }
  res.send(interaction);
});

const updateInteraction = catchAsync(async (req, res) => {
  const interaction = await interactionMessageService.updateInteractionById(req.params.interactionMessageId, req.body);
  res.send(interaction);
});

const deleteInteractions = catchAsync(async (req, res) => {
  await interactionMessageService.deleteInteractionMessageById(req.params.courseId, req.params.interactionMessageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInteractionMessage,
  getInteractions,
  getInteractionMessage,
  getInteractionsMessageAndCreateCron,
  getCourseInteractionMessage,
  updateInteraction,
  deleteInteractions,
};
