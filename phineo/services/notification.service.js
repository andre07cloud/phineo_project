const httpStatus = require('http-status');
const webpush = require('web-push');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service');

/**
 * Create a notification
 */
const createNotification = async (body) => {
    const subscription = body.subscription;
    const payload = JSON.stringify({ title: 'Section.io Push Notification' });
    const test = await webpush.sendNotification(subscription, payload)
    return test
};

/**
 * Create a notification
 */
const createNotificationTest = async (body) => {
    const subscription = body.subscription;
    const payload = JSON.stringify({ title: 'Section.io Push Notification' });
    const test = await webpush.sendNotification(subscription, payload)
    return test
};

/**
 * Send a notification
 */
const sendNotification = async (userId, payload) => {
    const user = await getUserById(userId)
    if (!user && !user.subscription) {
        return
    }
    const webPush = await webpush.sendNotification(user.subscription, payload)
    return webPush
};

/**
 * Send a notification
 */
const sendNotificationWithSub = async (subscription, payload) => {
    // const user = await getUserById(userId)
    if (!subscription || !payload) {
        return
    }
    const webPush = await webpush.sendNotification(subscription, payload)
    return webPush
};

/**
 * Query for notifications
 */
const queryNotifications = async (filter, options) => {
    const users = await User.find({})//paginate(filter, options);
    return users;
};

/**
 * Delete notification
 */
const deleteNotification = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
};

module.exports = {
    createNotification,
    createNotificationTest,
    sendNotification,
    sendNotificationWithSub,
    queryNotifications,
    deleteNotification,
};
