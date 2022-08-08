const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService, emailService, courseService } = require('../services');
const randomString = require('../utils/randomString');
const { interactionNodesTypes } = require('../config/interactionConfig');

const createUser = catchAsync(async (req, res) => {
  req.body.password = `${randomString(10)}5`;
  const user = await userService.createUser(req.body);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getUserInteractions = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId).populate('interactions');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }
  if (user.interactions.length > 0) {
    const interactionMessages = [];
    const interactionAnswer = {};
    user.interactions.map((item) => {
      if (item.finished === true) {
        let target = '';
        return item.content.nodes.map((nodeItem) => {
          if (nodeItem.id === target) {
            target = '';
            interactionMessages.push(nodeItem.data.label);
          }
          if (nodeItem.type === interactionNodesTypes.begin) {
            interactionMessages.push(nodeItem.data.label);
          } else if (nodeItem.type === interactionNodesTypes.question) {
            target = nodeItem.data.target;
            interactionMessages.push(nodeItem.data.label);
          } else if (nodeItem.type === interactionNodesTypes.message) {
            interactionMessages.push(nodeItem.data.label);
          } else if (nodeItem.type === interactionNodesTypes.end) {
            interactionMessages.push(nodeItem.data.label);
          }
        });
      }
      if (item.begin === true) {
      }
    });
    const dataToSend = { messages: interactionMessages, choice: interactionAnswer };
    res.send(dataToSend);
  } else {
    res.send([]);
  }
});

const updateUserInteractions = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId).populate('interactions');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }
  if (user.interactions.length > 0) {
    const interactionMessages = [];
    const interactionAnswer = {};
    user.interactions.map((item) => {
      if (item.finished === true) {
        let target = '';
        return item.content.nodes.map((nodeItem) => {
          if (nodeItem.id === target) {
            target = '';
            interactionMessages.push(nodeItem.data.label);
          }
          if (nodeItem.type === interactionNodesTypes.begin) {
            interactionMessages.push(nodeItem.data.label);
          } else if (nodeItem.type === interactionNodesTypes.question) {
            target = nodeItem.data.target;
            interactionMessages.push(nodeItem.data.label);
          } else if (nodeItem.type === interactionNodesTypes.message) {
            interactionMessages.push(nodeItem.data.label);
          } else if (nodeItem.type === interactionNodesTypes.end) {
            interactionMessages.push(nodeItem.data.label);
          }
        });
      }
      if (item.begin === true) {
      }
    });
    const dataToSend = { messages: interactionMessages, choice: interactionAnswer };
    console.log(dataToSend);
    res.send(dataToSend);
  } else {
    res.send([]);
  }
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const removeAssignment = catchAsync(async (req, res) => {
  await userService.removeAssignment(req.body);
  const course = await courseService.removeAssignment(req.body);
  res.status(httpStatus.OK).send(course);
});

const getUserStats = catchAsync(async (req, res) => {
  const userStats = await userService.getUserStatsById(req.params.userId);
  res.send(userStats);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserInteractions,
  updateUserInteractions,
  updateUser,
  deleteUser,
  removeAssignment,
  getUserStats,
};
