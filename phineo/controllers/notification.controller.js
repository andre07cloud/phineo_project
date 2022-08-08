const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
// const { updateUserById } = require('../services/user.service');
const { User } = require('../models');

const createNotifcation = catchAsync(async (req, res) => {
  const response = await notificationService.createNotification(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const createNotificationTest = catchAsync(async (req, res) => {
  const response = await notificationService.createNotificationTest(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const registerUserSubscription = catchAsync(async (req, res) => {
  const user = User.findByIdAndUpdate(req.params.userId, { subscription: req.body.subscription });
  // const user = updateUserById(req.params.userId, { subscription: req.body.subscription })
  res.send(user);
});

const sendNotification = async (userId, payload) => {
  const response = await notificationService.sendNotification(userId, payload);
  return response;
  // res.status(httpStatus.CREATED).send(response);
};

const getPendingNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.queryResponses(filter, options);
  // res.send(result);
  return result;
});

const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteResponseById(req.params.responseId);
  // res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNotifcation,
  createNotificationTest,
  registerUserSubscription,
  sendNotification,
  getPendingNotifications,
  deleteNotification,
};
