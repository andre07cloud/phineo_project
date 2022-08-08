const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserTotalTimePassed, getUserTimePassedOnCourse } = require('./log.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.find({}); // paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).populate({ path: 'courses', select: 'category title image assignments.length' });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserTagsById = async (id) => {
  return User.findById(id).select('tags');
};

/**
 * Get Only user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getOnlyUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserInfosById = async (id) => {
  return User.findById(id).select('email');
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Get user emrys by uid
 * @param {string} uid
 * @returns {Promise<User>}
 */
const getUserByUid = async (uid) => {
  return User.findOne({ uid });
};

const removeAssignment = async (data) => {
  const user = await getOnlyUserById(data.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  for (i = 0; i < user.courses.length; i++) {
    if (user.courses[i] == data.courseId) {
      user.courses.splice(i, 1);
    }
  }

  await user.save();
  return user;
};

const getUserStatsById = async (userId) => {
  const coursesToAvoid = [
    '625056b616f562c67ee6bfdf',
    '627cef43454b0c003e41bdcc',
    '627bec5777fb3126e504d199',
    '627bec7077fb31f81404d1a7',
    '627bec9a8f6df33efde535aa',
    '627becae8f6df33b30e535b1',
    '627becc28f6df3f02de535bd',
    '627becdd77fb31415804d1c7',
    '627becee77fb31c15804d1ce',
    '627bed038f6df32dd0e535cf',
  ];

  const userStats = await User.findById(userId)
    .select('courses firstName lastName createdAt')
    .populate({
      path: 'courses',
      select: 'title responses sections image',
      match: { _id: { $nin: coursesToAvoid }, visible: true },
      populate: [
        { path: 'responses', match: { userId: { $eq: userId } } },
        { path: 'sections', select: 'modules', populate: { path: 'modules', select: 'type' } },
      ],
    });

  const totalTimeOnPlatform = await getUserTotalTimePassed(userId);

  const logs = [];

  for (let x = 0; x < userStats.courses.length; x++) {
    // eslint-disable-next-line no-await-in-loop
    const logCourse = await getUserTimePassedOnCourse(userId, userStats.courses[x].id);
    logs.push({
      courseId: userStats.courses[x].id,
      logCourse,
    });
  }

  const user = {
    totalTimeOnPlatform: totalTimeOnPlatform.toFixed(2),
    userStats,
    inscriptionDate: userStats.createdAt,
    logs,
  };

  return user;
};

module.exports = {
  createUser,
  getOnlyUserById,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByUid,
  getUserInfosById,
  removeAssignment,
  getUserStatsById,
  getUserTagsById,
};
