const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { interactionService } = require('../services');

const createInteraction = catchAsync(async (req, res) => {
  const interaction = await interactionService.createInteraction(req.body);
  res.status(httpStatus.CREATED).send(interaction);
});

const updateAssignments = catchAsync(async (req, res) => {
  const interaction = await interactionService.updateInteractionAssignmentsById(req.params.interactionId, req.body);
  res.send(interaction);
});

const getInteractions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ids']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await interactionService.queryInteractions(filter, options);
  res.send(result);
});

const getInteractionsAndCreateCron = async () => {
  const result = await interactionService.queryInteractionsToCreateCron();
  console.log("INTERACTION CRON RESULT ===", result);
  return result
};

const getInteraction = catchAsync(async (req, res) => {
  const interaction = await interactionService.getInteractionById(req.params.interactionId);
  if (!interaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }
  res.send(interaction);
});

const getFullInteraction = catchAsync(async (req, res) => {
  const interaction = await interactionService.getFullInteractionById(req.params.interactionId);
  if (!interaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }
  res.send(interaction);
});

const updateInteraction = catchAsync(async (req, res) => {
  const interaction = await interactionService.updateInteractionById(req.params.interactionId, req.body);
  res.send(interaction);
});

const deleteInteractions = catchAsync(async (req, res) => {
  await interactionService.deleteInteractionById(req.params.interactionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInteraction,
  getInteractions,
  getInteraction,
  getInteractionsAndCreateCron,
  getFullInteraction,
  updateInteraction,
  updateAssignments,
  deleteInteractions,
};
